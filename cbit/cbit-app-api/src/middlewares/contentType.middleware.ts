import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';

export function contentTypeMiddleware(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers['content-type'];
  const contentLength = req.headers['content-length'];
  const transferEncoding = req.headers['transfer-encoding'];

  const hasBody = (contentLength && parseInt(contentLength as string, 10) > 0) || transferEncoding;

  // If a request has a body payload or sends a Content-Type header, it must conform to allowed types
  if (hasBody || contentType) {
    if (!contentType) {
      return res.status(HTTP_STATUS_CODE.UNSUPPORTED_MEDIA_TYPE).json({
        message: 'Content-Type header is required for requests carrying a payload.'
      });
    }

    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ];

    const isAllowed = allowedTypes.some(type => contentType.toLowerCase().startsWith(type));

    if (!isAllowed) {
      return res.status(HTTP_STATUS_CODE.UNSUPPORTED_MEDIA_TYPE).json({
        message: `Unsupported Media Type: '${contentType}'. Only JSON, URL-encoded, and Multipart Form-Data are allowed.`
      });
    }
  }

  next();
}

export default contentTypeMiddleware;
