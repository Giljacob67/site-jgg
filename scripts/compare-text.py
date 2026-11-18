"""Compara o texto visível de cada página do site antigo (HTML salvo) com o novo (URL local).
Uso: python3 -I scripts/compare-text.py <pasta-com-html-original> <url-base-nova>"""
import difflib, html, re, sys, urllib.request
old_dir, base = sys.argv[1], sys.argv[2].rstrip('/')
pages = ['index', 'diagnostico', 'radar', 'ferramentas', 'ferramentas/pequena-propriedade', 'ferramentas/arrendamento',
         'ferramentas/credito-rural', 'privacidade', 'radar/renegociacao-credito-rural-garantias',
         'radar/regularidade-ambiental-credito-rural', 'radar/arrendamento-rural-clausulas-essenciais',
         'radar/transacao-tributaria-passivo-rural', 'radar/holding-rural-planejamento-sucessorio',
         'radar/matricula-georreferenciamento-car']
def text(s):
    s = s[s.find('<body'):]
    s = re.sub(r'<(script|style|template)\b.*?</\1>', ' ', s, flags=re.S)
    s = re.sub(r'<div hidden="">.*$', ' ', s, flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return html.unescape(s).replace('↗', ' ↗').split()  # comparação por palavra
def links(s):
    return sorted(set(html.unescape(h) for h in re.findall(r'href="([^"]+)"', s[s.find('<body'):]) if not h.startswith('/_')))
total = 0
for p in pages:
    old = open(f"{old_dir}/{p.replace('/', '__')}.out", encoding='utf-8').read()
    new = urllib.request.urlopen(urllib.request.Request(f"{base}/{'' if p == 'index' else p}", headers={'user-agent': 'Mozilla/5.0 (site-jgg compare)'})).read().decode()
    d = [l for l in difflib.unified_diff(text(old), text(new), lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))]
    dl = [l for l in difflib.unified_diff(links(old), links(new), lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))]
    total += len(d) + len(dl)
    print(f"== /{'' if p == 'index' else p}: {len(d)} linhas de texto diferentes, {len(dl)} links diferentes")
    for l in d + ['  link ' + x for x in dl]: print('   ', l[:160])
print('TOTAL', total)
