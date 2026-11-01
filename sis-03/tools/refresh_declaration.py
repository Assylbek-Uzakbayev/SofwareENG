"""Measure current facts; never manufacture a commit or student identifier."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--student-id', default='24B032082')
parser.add_argument('--group', default='MON 16-00')
args = parser.parse_args()
run = subprocess.run([sys.executable, 'tests/check_sis.py', '--json'], cwd=root, capture_output=True, text=True)
data = json.loads(run.stdout)
m = data['measured']
fails = [r['id'] for r in data['rows'] if r['verdict'] != 'PASS']
commit_run = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=root, capture_output=True, text=True)
commit = commit_run.stdout.strip() if commit_run.returncode == 0 else 'not-created'
q = json.dumps
lines = ['schema: 1', 'assignment: "sis-03"', 'student:', '  name: "Uzakbayev Assylbek"',
         '  student_id: '+q(args.student_id), '  group: '+q(args.group), '  github: "Assylbek-Uzakbayev"',
         'assistant:', '  tool: "ChatGPT Work / Codex"', '  model: "not displayed"',
         'bolt:', '  model: "not displayed"', '  project_url: "not-shared"',
         'language:', '  name: "python"', '  path: "A"', 'reuse:', '  python_v1: "fresh"', '  web_v1: "fresh"',
         'checker:', '  pass: '+str(data['counts']['PASS']), '  fail: '+str(data['counts']['FAIL']),
         '  error: '+str(data['counts']['ERROR']), '  commit: '+q(commit), 'counts:']
for k in ['tests','exchanges','issues','critique_decisions','reflection_words']:
    lines.append('  '+k+': '+str(m.get(k, 0)))
lines += ['cases:']
for k in ['python_final_matches','page_final_matches']: lines.append('  '+k+': '+str(m.get(k,0)))
lines += ['known_fails: ['+', '.join(fails)+']', 'honesty:', '  v1_unedited: "yes"',
          '  screenshots_unedited: "yes"', '  results_observed: "yes"', '  ai_usage_disclosed: "yes"']
# Supplied T1 captures are unedited; missing required captures remain declared as known fails.
(root/'submission.yml').write_text('\n'.join(lines)+'\n', encoding='utf-8')
report = (root/'report.md').read_text(encoding='utf-8')
marker = '\n<!-- measured-checker-limitations -->\n'
report = report.split(marker)[0]
report += marker+'\n| Check ID | Current checker observation | Required next step |\n| --- | --- | --- |\n'
for r in data['rows']:
    if r['verdict'] != 'PASS':
        report += '| '+r['id']+' | '+r['message'].replace('|','/')+' | Complete the genuine missing evidence described above, then rerun. |\n'
(root/'report.md').write_text(report, encoding='utf-8')
print('Checker:', data['counts'])
print('Known unresolved checks:', ', '.join(fails))
print('Student metadata:', args.student_id, '/', args.group)
print('Commit:', commit)
