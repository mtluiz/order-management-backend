import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@/infrastructure/http/modules/app.module";
import { ApiServerConfig } from "@/infrastructure/config/ApiServerConfig";

export class ServerApplication {

    private readonly host: string = ApiServerConfig.HOST;
    private readonly port: number = ApiServerConfig.PORT;

    public async run(): Promise<void> {
        const app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter()
        );

        await this.setupDocumentation(app);
        await app.listen(this.port, this.host);
        this.log();
    }

    private async setupDocumentation(app: NestFastifyApplication): Promise<void> {

        const title = 'API';
        const description = 'API description';
        const version = '1.0';

        const config = new DocumentBuilder()
            .setTitle(title)
            .setDescription(description)
            .setVersion(version)
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);

    }

    private log() {
        Logger.log(`Server is running on ${this.host}:${this.port}`);
    }
}