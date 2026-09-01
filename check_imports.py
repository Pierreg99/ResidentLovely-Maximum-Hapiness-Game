import os, re
for root, dirs, files in os.walk('src'):
    for f in files:
        if not f.endswith('.js'): continue
        path = os.path.join(root, f)
        with open(path) as file:
            for line in file:
                m = re.search(r'import\s+.*from\s+[\'"]([^\'"]+)[\'"]', line)
                if m:
                    rel_path = m.group(1)
                    if rel_path.startswith('.'):
                        target = os.path.normpath(os.path.join(os.path.dirname(path), rel_path))
                        if not os.path.exists(target):
                            print(f"MISSING: {target} imported in {path}")
