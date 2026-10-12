"""Run local checks and record their actual output and current Git hash."""
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent


def run(args, cwd=ROOT):
    result = subprocess.run(args, cwd=cwd, text=True, encoding="utf-8",
                            errors="replace", stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
    print(result.stdout, end="")
    return result


def block(text, heading, output):
    pattern = r"(" + re.escape(heading) + r"\n[\s\S]*?```text\n)[\s\S]*?(\n```)"
    text, count = re.subn(pattern, lambda m: m[1] + output.rstrip() + m[2], text, count=1)
    if count != 1:
        raise RuntimeError("Missing evidence block: " + heading)
    return text


def main():
    commit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, text=True).strip()
    suite = run([sys.executable, "-m", "unittest", "-v"], ROOT / "code")
    if suite.returncode:
        raise SystemExit("Tests failed. Send the output to your assistant.")
    file = ROOT / "lab-report.md"
    report = block(file.read_text(encoding="utf-8"), "### 8.1 My suite, final run", suite.stdout)
    report = re.sub(r"Environment: assistant Python .*?computer\.",
                    "Environment: current computer, Python " + sys.version.split()[0] + ".", report)
    file.write_text(report, encoding="utf-8")
    checker = run([sys.executable, "tests/check_booking.py"])
    report = block(report, "### 8.2 The checker, final run", checker.stdout)
    file.write_text(report, encoding="utf-8")
    verified = run([sys.executable, "tests/check_booking.py"])
    if checker.stdout != verified.stdout:
        raise SystemExit("Checker changed after evidence update. Run this script again.")
    match = re.search(r"SUMMARY pass=(\d+) fail=(\d+) error=(\d+)", verified.stdout)
    if not match:
        raise SystemExit("Cannot read checker counts.")
    counts = [int(x) for x in match.groups()]
    failed = re.findall(r"^(?:FAIL|ERROR)\s+([A-Z]\d+)\s", verified.stdout, re.M)
    declaration_file = ROOT / "submission.yml"
    declaration = declaration_file.read_text(encoding="utf-8")
    for key, value in zip(("pass", "fail", "error"), counts):
        declaration = re.sub(r"(?m)^  " + key + r":.*$", "  " + key + ": " + str(value), declaration)
    declaration = re.sub(r"(?m)^  commit:.*$", '  commit: "' + commit + '"', declaration)
    declaration = re.sub(r"(?m)^  known_fails:.*$", "  known_fails: [" + ", ".join(failed) + "]", declaration)
    declaration = re.sub(r"(?m)^  tests:.*$", "  tests: " + re.search(r"Ran (\d+) tests?", suite.stdout)[1], declaration)
    declaration_file.write_text(declaration, encoding="utf-8")
    validation = run([sys.executable, "tests/validate_submission.py"])
    if validation.returncode or any(counts[1:]):
        raise SystemExit("Checks need attention. Share this output with your assistant.")
    print("Evidence refreshed; checker commit:", commit)
    print("Student review, personal conclusion and open PR submission still required.")


if __name__ == "__main__":
    main()
