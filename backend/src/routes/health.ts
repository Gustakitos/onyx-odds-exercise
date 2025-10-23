import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Sports Prediction API is running',
      timestamp: new Date().toISOString(),
      database: 'Connected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API is not running',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;