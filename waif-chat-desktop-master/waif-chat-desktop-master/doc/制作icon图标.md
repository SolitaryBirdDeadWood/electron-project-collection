# 制作mac图标

1. 一个.icns 应用图标需要准备以下 10 种不同大小的.png图片文件

- 512x512 pt (512x512 px @1x, 1024x1024 px @2x)
- 256x256 pt (256x256 px @1x, 512x512 px @2x)
- 128x128 pt (128x128 px @1x, 256x256 px @2x)
- 32x32 pt (32x32 px @1x, 64x64 px @2x)
- 16x16 pt (16x16 px @1x, 32x32 px @2x)

2. 因此我们需要准备一张高清的png图片，要求图片尺寸为`1024 X 1024`，以生成上述不同尺寸的png图片

3. 创建一个文件夹名为 `icon`

4. 在 `icon` 文件夹中 创建一个名为 icons.iconset的子文件夹，以及放置名为 icon.png 的原始图片资源

5. 打开终端，进入 `icon` 文件夹，执行以下命令

```bash
sips -z 16 16 icon.png -o icons.iconset/icon_16x16.png
sips -z 32 32 icon.png -o icons.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png -o icons.iconset/icon_32x32.png
sips -z 64 64 icon.png -o icons.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png -o icons.iconset/icon_128x128.png
sips -z 256 256 icon.png -o icons.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png -o icons.iconset/icon_256x256.png
sips -z 512 512 icon.png -o icons.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png -o icons.iconset/icon_512x512.png
sips -z 1024 1024 icon.png -o icons.iconset/icon_512x512@2x.png
```

6. 在终端中继续输入如下命令

```bash
iconutil -c icns icons.iconset -o icon.icns
```

# windows图标制作
Window 需要的 ico 格式，需要专门的工具进行制作，这里推荐网上能直接访问的在线工具。比如：https://redketchup.io/icon-converter，将之前准备好的底稿上传，然后，调整好参数，直接 Download，就得到了 256px 的 ico 格式图标。