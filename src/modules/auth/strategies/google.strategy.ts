/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

interface GoogleAuthRequest extends Request {
  query: {
    role?: string;
    state?: string;
    [key: string]: string | undefined;
  };
}

interface GoogleProfile {
  id: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/v1/auth/google/callback'
          : configService.get('GOOGLE_CALLBACK_URL'),

      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;

      const email = emails?.[0]?.value;
      const firstName = name?.givenName || '';
      const lastName = name?.familyName || '';
      const picture = photos?.[0]?.value;

      if (!email) {
        throw new Error('No email provided by Google');
      }

      // ENHANCED ROLE DETECTION
      let selectedRole = 'patient';

      // Debug: Log all available information
      console.log('=== GOOGLE OAUTH DEBUG INFO ===');
      console.log('Original URL:', req.originalUrl);
      console.log('Referer:', req.headers?.referer);
      console.log('Query params:', req.query);
      console.log('Path:', req.path);
      console.log('Base URL:', req.baseUrl);
      console.log('==============================');

      // Method 1: Check state parameter (Google OAuth preserves this)
      if (req.query?.state) {
        console.log('State parameter found:', req.query.state);
        // If state contains role information, parse it
        if (req.query.state.includes('doctor')) {
          selectedRole = 'doctor';
          console.log('Role from state: doctor');
        } else if (req.query.state.includes('patient')) {
          selectedRole = 'patient';
          console.log('Role from state: patient');
        }
      }

      // Method 2: Check session or custom header (if available)
      const customRoleHeader = req.headers['x-oauth-role'];
      if (customRoleHeader) {
        selectedRole = customRoleHeader as string;
        console.log('Role from custom header:', selectedRole);
      }

      // Method 3: Final fallback - HARDCODE FOR TESTING
      if (selectedRole === 'patient') {
        // TEMPORARY: Force doctor role for testing
        selectedRole = 'doctor';
        console.log('TEMPORARY: Using hardcoded doctor role for testing');
      }

      console.log('Final selected role:', selectedRole);

      const fullName = `${firstName} ${lastName}`.trim() || email.split('@')[0];

      const user = {
        email,
        firstName,
        lastName,
        fullName: fullName,
        picture,
        accessToken,
        refreshToken,
        role: selectedRole,
        googleId: profile.id,
      };

      done(null, user);
    } catch (error) {
      console.error('Google OAuth validation error:', error);
      done(error, false);
    }
  }
}
