// Declara que qualquer arquivo terminado em ".png" pode ser importado como um módulo.
// Isso remove o erro "Cannot find module..." ao importar imagens PNG.
declare module '*.png';

// Declara que arquivos ".jpg" são módulos válidos.
declare module '*.jpg';

// Declara que arquivos ".jpeg" (outra extensão para JPEG) são módulos válidos.
declare module '*.jpeg';

// Declara que arquivos ".gif" (imagens animadas ou estáticas) são módulos válidos.
declare module '*.gif';

// Declara que arquivos ".bmp" (Bitmaps) são módulos válidos.
declare module '*.bmp';

// Declara que arquivos ".tiff" (Tagged Image File Format) são módulos válidos.
declare module '*.tiff';