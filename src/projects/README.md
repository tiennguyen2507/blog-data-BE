# Projects Module

Module quản lý các dự án với đầy đủ chức năng CRUD và phân trang.

## Features

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Phân trang với pagination.ts
- ✅ Authentication với AuthGuard
- ✅ Validation với class-validator
- ✅ Swagger documentation
- ✅ MongoDB với Mongoose

## API Endpoints

### POST /projects

Tạo project mới (yêu cầu authentication)

**Body:**

```json
{
  "title": "Tên dự án",
  "description": "Mô tả dự án",
  "thumbnail": "https://example.com/image.jpg", // optional
  "skill": ["Javascript", "React", "HTML", "CSS"] // optional, default: []
}
```

### GET /projects

Lấy danh sách projects với phân trang

**Query Parameters:**

- `page`: Số trang (mặc định: 1)
- `limit`: Số items mỗi trang (mặc định: 10)

### GET /projects/:id

Lấy thông tin project theo ID

### PATCH /projects/:id

Cập nhật project (yêu cầu authentication)

### DELETE /projects/:id

Xóa project (yêu cầu authentication)

## Schema

```typescript
{
  title: string;           // Tên dự án (bắt buộc)
  description: string;     // Mô tả dự án (bắt buộc)
  status: boolean;         // Trạng thái (mặc định: true)
  thumbnail?: string;      // Hình ảnh thumbnail (tùy chọn)
  skill: string[];         // Mảng các kỹ năng (mặc định: [])
  createdAt: Date;         // Ngày tạo
  updatedAt: Date;         // Ngày cập nhật
  createdBy: ObjectId;     // ID người tạo (tham chiếu User)
}
```

## Dependencies

- `@nestjs/common`
- `@nestjs/mongoose`
- `mongoose`
- `class-validator`
- `class-transformer`
- `@nestjs/swagger`
