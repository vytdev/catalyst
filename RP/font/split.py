import os
from PIL import Image

for r in range(0, 255):
	# the glyph name
	folder = f"glyph_{r:02X}"
	source = folder + ".png"

	# check if glyph exists
	if not os.path.isfile(source):
		continue

	# the glyph folder
	os.makedirs(folder, exist_ok=True)

	# initialize the sprite sheet
	sheet = Image.open(source)
	width, height = sheet.size

	# width and height should be equal
	if width != height:
		print(f"{source} aspect ratio should be 1:1")
		continue

	# size of each sprite
	sprite_size = width // 16

	# split the glyph sheet
	for x in range(16):
		for y in range(16):

			# sprite uv offset
			x_offset = x * sprite_size
			y_offset = y * sprite_size

			# crop and save the sprite
			sprite = sheet.crop((
				x_offset, y_offset,
				x_offset + sprite_size,
				y_offset + sprite_size
			))
			sprite.save(os.path.join(folder, f"glyph_{r:02X}{y:01X}{x:01X}.png"))
