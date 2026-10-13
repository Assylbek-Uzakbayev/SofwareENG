"""Run the provided SIS checks and write actual counts/current Git hash."""
from pathlib import Path
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parent


def main():
    commit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, text=True).strip()
    run = subprocess.run([sys.executable, "tests/check_report.py", "--json"], cwd=ROOT,
                         text=True, encoding="utf-8", errors="replace", stdout=subprocess.PIPE)
    data = json.loads(run.stdout)
    human = subprocess.run([sys.executable, "tests/check_report.py"], cwd=ROOT,
                           text=True, encoding="utf-8", errors="replace", stdout=subprocess.PIPE,
                           stderr=subprocess.STDOUT)
    print(human.stdout)
    (ROOT / "checker_output.txt").write_text(human.stdout, encoding="utf-8")
    counts, measured = data["counts"], data["measured"]
    failing = [row["id"] for row in data["rows"] if row["verdict"] != "PASS"]
    if failing:
        raise SystemExit("Report needs attention. Share the output; do not invent counts.")
    text = '''schema: 1
assignment: "sis-01"

student:
  name: "Assylbek Uzakbayev"
  student_id: "24B032082"
  group: "Monday, 16:00-19:00"
  github: "Assylbek-Uzakbayev"

topic: "1.1"

assistant:
  tool: "ChatGPT / Codex"
  model: "GPT 6.1 sol"

checker:
  pass: {pass_count}
  fail: {fail_count}
  error: {error_count}
  commit: "{commit}"

counts:
  main_words: {main_words}
  reflection_words: {reflection_words}
  exchanges: {exchanges}
  verified_claims: {verified_claims}
  revisions: {revisions}

decisions:
  keep: {keep}
  qualify: {qualify}
  reject: {reject}

known_fails: []
'''.format(pass_count=counts["PASS"], fail_count=counts["FAIL"], error_count=counts["ERROR"],
           commit=commit, main_words=measured["main_words"],
           reflection_words=measured["reflection_words"], exchanges=measured["exchanges"],
           verified_claims=measured["verified_claims"], revisions=measured["revisions"],
           keep=measured["decisions"]["keep"], qualify=measured["decisions"]["qualify"],
           reject=measured["decisions"]["reject"])
    (ROOT / "submission.yml").write_text(text, encoding="utf-8")
    validation = subprocess.run([sys.executable, "tests/validate_submission.py"], cwd=ROOT,
                                text=True, encoding="utf-8", errors="replace", stdout=subprocess.PIPE,
                                stderr=subprocess.STDOUT)
    print(validation.stdout)
    (ROOT / "validator_output.txt").write_text(validation.stdout, encoding="utf-8")
    if validation.returncode:
        raise SystemExit("Declaration needs attention. Send the output to your assistant.")
    print("Recorded actual checker commit:", commit)
    print("Checks cover shape; student reflection, source reading and process review remain required.")


if __name__ == "__main__":
    main()
