import Image, ImageDraw
from colors import colors


def hex2dec(s):
    return int('0x' + s, 16)


for color_index, row in enumerate(colors):
    for shade, color in zip(['', '.a', '.b'], row):
        print '.solid.color%s%s' % (color_index, shade)
        print '  background-color: #' + color

        img = Image.new('P', (128,128), 0)
        img.putpalette((
            0,0,0,
            hex2dec(color[:2]),hex2dec(color[2:4]),hex2dec(color[4:])
        ))
        draw = ImageDraw.Draw(img)
        for x in range(-8, 8):
            draw.line((-16+x,-16,148+x,148), fill=1)
        img.convert('P', colors=2)
        img.save('stripes/%s%s.gif' % (color_index, shade), transparency=0)
