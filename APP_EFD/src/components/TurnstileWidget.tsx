import React from 'react';
import { Turnstile, type TurnstileProps, type TurnstileInstance } from '@marsidev/react-turnstile';

/**
 * Cloudflare Turnstile Widget Component
 * Handles the "invisible" captcha verification.
 */

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    // You can add more props if needed, like theme or size
}

const TEST_SITE_KEY = "1x00000000000000000000AA";

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onVerify }) => {
    // Determine the site key based on the environment
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || TEST_SITE_KEY;

    // Log for debugging (only in development)
    if (import.meta.env.DEV) {
        console.log("Turnstile using siteKey:", siteKey === TEST_SITE_KEY ? "TEST_SITE_KEY" : "PRODUCTION_SITE_KEY");
    }

    const handleSuccess: TurnstileProps['onSuccess'] = (token) => {
        onVerify(token);
    };

    return (
        <div className="flex justify-center my-4">
            <Turnstile
                siteKey={siteKey}
                onSuccess={handleSuccess}
                options={{
                    appearance: 'interaction-only', // "invisible" style but prompts if suspicious
                }}
            />
        </div>
    );
};

export default TurnstileWidget;
export type { TurnstileInstance };
