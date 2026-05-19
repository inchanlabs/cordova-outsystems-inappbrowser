#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const projectRoot = context.opts.projectRoot;
    
    // Paths to check (handles multiple Cordova project layouts)
    const paths = [
        path.join(projectRoot, 'platforms/android/app/src/main/AndroidManifest.xml'),
        path.join(projectRoot, 'platforms/android/AndroidManifest.xml')
    ];

    paths.forEach(manifestPath => {
        if (fs.existsSync(manifestPath)) {
            let content = fs.readFileSync(manifestPath, 'utf8');

            // List of target permissions to destroy
            const permissionsToRemove = [
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.RECORD_AUDIO',
                'android.permission.MODIFY_AUDIO_SETTINGS',
                'android.permission.CAMERA'
            ];

            permissionsToRemove.forEach(per => {
                // Creates a regex to find the permission element regardless of spacing/formatting
                const regex = new RegExp(`<uses-permission[^>]*android:name="${per}"[^>]*\\/>`, 'g');
                content = content.replace(regex, '');
            });

            fs.writeFileSync(manifestPath, content, 'utf8');
            console.log('>>> [SUCCESS] Force-removed unwanted media and location permissions.');
        }
    });
};
