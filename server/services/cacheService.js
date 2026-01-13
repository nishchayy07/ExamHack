import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '../cache');
const CACHE_EXPIRY_DAYS = 7;

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log('📁 Cache directory created');
}

/**
 * Generate cache key from course code
 */
function getCacheKey(courseCode) {
  return crypto.createHash('md5').update(courseCode.toUpperCase()).digest('hex');
}

/**
 * Get cached analysis result
 */
function getCachedAnalysis(courseCode) {
  try {
    const cacheKey = getCacheKey(courseCode);
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
    
    if (!fs.existsSync(cacheFile)) {
      console.log(`💾 Cache MISS for ${courseCode}`);
      return null;
    }
    
    const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    const cacheAge = Date.now() - cacheData.timestamp;
    const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (cacheAge > expiryMs) {
      console.log(`⏰ Cache EXPIRED for ${courseCode} (${Math.floor(cacheAge / (24 * 60 * 60 * 1000))} days old)`);
      fs.unlinkSync(cacheFile);
      return null;
    }
    
    console.log(`✅ Cache HIT for ${courseCode} (${Math.floor(cacheAge / (60 * 60 * 1000))} hours old)`);
    return cacheData.result;
    
  } catch (error) {
    console.error('❌ Cache read error:', error.message);
    return null;
  }
}

/**
 * Store analysis result in cache
 */
function setCachedAnalysis(courseCode, result) {
  try {
    const cacheKey = getCacheKey(courseCode);
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
    
    const cacheData = {
      courseCode: courseCode.toUpperCase(),
      timestamp: Date.now(),
      result: result
    };
    
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    console.log(`💾 Cached analysis for ${courseCode}`);
    
  } catch (error) {
    console.error('❌ Cache write error:', error.message);
  }
}

/**
 * Clear all expired cache entries
 */
function clearExpiredCache() {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    let cleared = 0;
    
    files.forEach(file => {
      const filePath = path.join(CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      const age = Date.now() - stats.mtimeMs;
      
      if (age > expiryMs) {
        fs.unlinkSync(filePath);
        cleared++;
      }
    });
    
    if (cleared > 0) {
      console.log(`🗑️ Cleared ${cleared} expired cache entries`);
    }
    
  } catch (error) {
    console.error('❌ Cache cleanup error:', error.message);
  }
}

export {
  getCachedAnalysis,
  setCachedAnalysis,
  clearExpiredCache
};

