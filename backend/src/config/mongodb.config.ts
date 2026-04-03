import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export function getMongodbConfig(configService: ConfigService): MongooseModuleOptions {
	return {
		uri: configService.getOrThrow<string>('MONGO_URI'),
	};
	
}