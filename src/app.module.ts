import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { SupportModule } from './modules/support/support.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const nodeEnv: string = configService.get('NODE_ENV') || 'development';
        const databaseUrl: string = configService.get('DATABASE_URL') || '';

        console.log('🔍 Environment:', nodeEnv);
        console.log(
          '🔍 Using database:',
          nodeEnv === 'production' ? 'Render PostgreSQL' : 'Local PostgreSQL',
        );

        // Different configuration for production vs development
        const isProduction: boolean = nodeEnv === 'production';

        if (isProduction) {
          // Render PostgreSQL configuration (with SSL)
          const productionConfig: TypeOrmModuleOptions = {
            type: 'postgres',
            url: databaseUrl,
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false, // Required for Render
              },
            },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Never sync in production
            logging: false, // Disable logging in production
          };
          return productionConfig;
        } else {
          // Local PostgreSQL configuration (no SSL)
          const developmentConfig: TypeOrmModuleOptions = {
            type: 'postgres',
            url: databaseUrl,
            ssl: false, // No SSL for local development
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Safe to sync in development
            logging: true, // Enable logging in development
          };
          return developmentConfig;
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PatientsModule,
    SupportModule,
    DoctorsModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('✅ Database setup successful!');
    this.logger.log('✅ Schedula Backend started successfully!');
  }
}
