"""Run from the project root: python3 tests/verify_content.py."""
from pathlib import Path
import re
old=Path('backup/index.html').read_text()
new=Path('index.html').read_text()
for service in ['service-rf','service-ai','service-transition','service-fresh']:
    pattern=rf'<section class="view" id="{service}".*?</section>'
    assert re.search(pattern,old,re.S).group()==re.search(pattern,new,re.S).group(),service
    print('PASS: original detailed service HTML unchanged:',service)
assert sorted(re.findall(r'href="(mailto:[^"]+)"',old))==sorted(re.findall(r'href="(mailto:[^"]+)"',new))
print('PASS: all original mailto links unchanged')
for f in re.findall(r'(?:src|href)="([^"#?]+)"',new):
    if ':' not in f: assert Path(f).is_file(),f
for f in Path('js').glob('*.js'):
    for dependency in re.findall(r"from ['\"]([^'\"]+)",f.read_text()):
        assert (f.parent/dependency).is_file(),dependency
print('PASS: local assets and scene module imports exist')
assert '<style>' not in new and '<script>' not in new
print('PASS: duplicate inline CSS and JS removed')
