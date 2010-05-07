from colors import colors

for i, row in enumerate(colors):
    for selector, color in zip(('', '.active', '.targeted'), row):
        rule = '.color%s%s' % (i, selector)
        if selector:
            rule += ', .color%s %s' % (i, selector)
        rule += ' { background-color: #%s; }' % color
        print rule
