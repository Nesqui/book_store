import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async askConfirmation(to: string, confirmationHash: string, username: string) {
        const confirmationUrl = `${this.configService.get('APP_URL')}/users/accept?confirmationHash=${confirmationHash}&username=${username}`;
        const templatePath = path.resolve(__dirname, '../templates', 'confirmation.template.hbs');
        const templateSource = await fs.readFile(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const htmlMessage = template({ confirmationUrl });
        await this.mailService.sendMail({
            to,
            subject: 'Please confirm your registration',
            html: htmlMessage,
        });
    }

    async onSuccessConfirmation(to: string) {
        const templatePath = path.resolve(__dirname, '../templates', 'confirmed.template.hbs');
        const templateSource = await fs.readFile(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const htmlMessage = template({});
        await this.mailService.sendMail({
            to,
            subject: 'Successfully confirmed, now you can login',
            html: htmlMessage,
        });
    }
}
