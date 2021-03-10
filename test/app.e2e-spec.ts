import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist : true,
                forbidNonWhitelisted : true,
                transform: true,
            }),
        );
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Welcome to my Movie API');
    });

    describe("/movies", () => {

        it('GET', function () {
            return request(app.getHttpServer())
                .get("/movies")
                .expect(200)
                .expect([]);
        });
        it('POST 201', function () {
            return request(app.getHttpServer())
                .post('/movies')
                .send({
                    "title" : "TestTitle",
                    "year" : 2020
                })
                .expect(201);
        });

        it('POST 400', () => {
            return request(app.getHttpServer())
                .patch('/movies/1')
                .send({
                    title : "patch",
                    error : "this is invalid data"
                })
                .expect(400);
        })
        it("DELETE", () => {
            return request(app.getHttpServer())
                .delete('/movie')
                .expect(404)
        });

    })


    describe('/movies/:id', () => {
        it('GET 200', () => {
            return request(app.getHttpServer())
                .get("/movies/1")
                .expect(200);
        });
        it('PATCH', () => {
            return request(app.getHttpServer())
                .patch('/movies/1')
                .send({
                    title : "patch"
                })
                .expect(200);
        })
        it('DELETE', () => {
            return request(app.getHttpServer())
                .delete('/movies/1')
                .expect(200)
        });
    })
});
