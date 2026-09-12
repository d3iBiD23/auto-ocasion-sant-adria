package es.autoocasion;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import javax.imageio.*;
import javax.imageio.stream.ImageOutputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/** Stores a web-sized JPEG and a lightweight thumbnail for every uploaded photo. */
@Service
public class ImageStorage {
  @Value("${app.upload-dir}") String uploadDir;

  public String store(MultipartFile file, String prefix) throws IOException {
    if (file == null || file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/"))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se permiten imágenes.");
    if (file.getSize() > 15L * 1024 * 1024)
      throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Cada imagen puede ocupar un máximo de 15 MB.");
    BufferedImage source;
    try (InputStream input = file.getInputStream()) { source = ImageIO.read(input); }
    if (source == null)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pudo leer la imagen.");
    Path root = Path.of(uploadDir), thumbs = root.resolve("thumbs");
    Files.createDirectories(thumbs);
    String filename = prefix + "-" + UUID.randomUUID() + ".jpg";
    writeJpeg(source, root.resolve(filename), 1600, 0.84f);
    writeJpeg(source, thumbs.resolve(filename), 560, 0.72f);
    return "/uploads/" + filename;
  }

  public void delete(String publicPath) throws IOException {
    if (publicPath == null || !publicPath.startsWith("/uploads/")) return;
    String filename = Path.of(publicPath).getFileName().toString();
    Files.deleteIfExists(Path.of(uploadDir, filename));
    Files.deleteIfExists(Path.of(uploadDir, "thumbs", filename));
  }

  private void writeJpeg(BufferedImage source, Path output, int maxSide, float quality) throws IOException {
    double scale = Math.min(1d, maxSide / (double) Math.max(source.getWidth(), source.getHeight()));
    int width = Math.max(1, (int) Math.round(source.getWidth() * scale));
    int height = Math.max(1, (int) Math.round(source.getHeight() * scale));
    BufferedImage rendered = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
    Graphics2D graphics = rendered.createGraphics();
    graphics.setColor(Color.WHITE);
    graphics.fillRect(0, 0, width, height);
    graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
    graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
    graphics.drawImage(source, 0, 0, width, height, null);
    graphics.dispose();
    ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
    try (ImageOutputStream stream = ImageIO.createImageOutputStream(Files.newOutputStream(output))) {
      writer.setOutput(stream);
      ImageWriteParam params = writer.getDefaultWriteParam();
      params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
      params.setCompressionQuality(quality);
      writer.write(null, new IIOImage(rendered, null, null), params);
    } finally { writer.dispose(); }
  }
}
