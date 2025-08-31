1. instalaciones:
   npm install multer @nestjs/platform-express
   npm install --save-dev @types/multer

2. Docker:
   docker build -t docx-pdf-service .
   docker run -p 3000:3000 docx-pdf-service
