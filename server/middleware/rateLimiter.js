import rateLimit from 'express-rate-limit';

// Rate limiter for analyze endpoint
export const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour per IP
  message: {
    success: false,
    message: 'Bhai, thoda ruk ja! Too many requests - please try again after 1 hour. 😅',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Bhai, thoda ruk ja! Too many requests - please try again after 1 hour. 😅',
      retryAfter: '1 hour'
    });
  }
});

// Rate limiter for scrape endpoint (more lenient)
export const scrapeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: {
    success: false,
    message: 'Too many scrape requests - please try again after 1 hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});
