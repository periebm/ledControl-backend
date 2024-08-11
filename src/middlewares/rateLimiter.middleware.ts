import { HttpStatusCode } from 'axios';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // maximum number of requests allowed in the windowMs
  handler: (req, res) => {
    console.error('ERROR : rateLimiter Middleware');

    return res.status(HttpStatusCode.TooManyRequests).send({
      success: false,
      statusCode: HttpStatusCode.TooManyRequests,
      message:
        'You have exceeded the maximum number of requests. Please try again later. If you continue to experience issues, please contact our team.',
    });
  },
});

export default limiter;