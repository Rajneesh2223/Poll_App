/**
 * Validates required environment variables on application startup
 * Fails fast if critical configuration is missing
 */
const validateEnv = () => {
    const required = [
        'MONGO_DB_URL'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));
        console.error('\nPlease check your .env file and ensure all required variables are set.');
        console.error('Refer to .env.example for the required configuration.\n');
        process.exit(1);
    }

    // Validate PORT if provided
    if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
        console.error('❌ PORT must be a valid number');
        process.exit(1);
    }

    console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
