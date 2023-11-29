require 'redis'

def check_redis_health
  redis = Redis.new(host: 'redis', port: 6379)
  redis.ping
rescue StandardError => e
  puts "Error checking Redis health: #{e.message}"
  exit(1)
end

check_redis_health
