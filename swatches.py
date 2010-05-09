from colors import colors

for row in colors:
    for cell in row:
        print ('<div style="background-color: #%s; height: 16px; ' +
               'width: 16px; float:left"></div>\n') % cell
    print '<div style="clear: both"></div>'
