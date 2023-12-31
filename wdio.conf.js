const {join} = require('path')
const allure = require('allure-commandline')
//const video = require('wdio-video-reporter')

exports.config = {
    hostname: 'localhost',
    port: 4723,
    path: '/wd/hub',
    specs:[
        './test/specs/**/*.spec.js'
    ],
    framework: 'mocha',
    capabilities: [{
        "platformName": "Android",
        "appium:platformVersion": "9.0",
        "appium:deviceName": "EBAC",
        "appium:automationName": "UiAutomator2",
        "appium:appPackage": "com.woocommerce.android",
        "appium:appActivity": ".ui.main.MainActivity",
        "appium:appWaitActivity": "com.woocommerce.android.ui.login.LoginActivity"
    }],
    
    waitForTimeout: 50000,
    mochaOpts: {timeout: 300000},

    reporters: ['spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }],
//        [video, {
//            saveAllVideos: false,       // If true, also saves videos for successful test cases
//            videoSlowdownMultiplier: 3 // Higher to get slower videos, lower for faster videos [Value 1-100]
//        }]
    ],

    onComplete: function() {
        const reportError = new Error('Could not generate Allure report')
        const generation = allure(['generate', 'allure-results', '--clean'])
        return new Promise((resolve, reject) => {
            const generationTimeout = setTimeout(() => reject(reportError), 5000)
            generation.on('exit', function(exitCode) {
                clearTimeout(generationTimeout)
                if (exitCode !== 0) {
                    return reject(reportError)
                }
                console.log('Allure report successfully generated')
                resolve()
            })
        })
    },

    afterStep: async function (step, scenario, { error, duration, passed }, context) {
        await driver.takeScreenshot();
    }
}