import os
from PIL import Image

for r in range(0, 255):
	# the glyph name
	folder = f"glyph_{r:02X}"
	source = folder + ".png"

	# check if folder exists
	if not os.path.isdir(folder):
		continue

	sprites = os.listdir(folder)
	# folder is empty
	if len(sprites) == 0:
		continue

	sprite_size = Image.open(os.path.join(folder, sprites[0])).size[0]

	sheet = Image.new("RGBA", (sprite_size * 16, sprite_size * 16), (0, 0, 0, 0))

	# split the glyph sheet
	for x in range(16):
		for y in range(16):
			# path to sprite
			sprite_path = os.path.join(folder, f"glyph_{r:02X}{y:01X}{x:01X}.png")

			# sprite not exists
			if not os.path.isfile(sprite_path):
				continue

			# the sprite
			sprite = Image.open(sprite_path)

			# paste offset
			x_offset = x * sprite_size
			y_offset = y * sprite_size

			# paste tbe sprite
			sheet.paste(sprite, (x_offset, y_offset))

	# save the sheet
	sheet.save(source)
