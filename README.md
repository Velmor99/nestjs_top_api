1. Models
  в Файлах моделей описаны наши модели сущностей, они сделаны на классах так как тогда легче использовать декораторы с ними

2. Controllers
  По сути входная точка нашего приложения, в них приходят HTTP запросы. На уровне приложения мы можем задать глобальный префикс API.
  Контроллеры это классы которые декорированы декоратором @Controller, внутрь этого декоратора мы можем передать путь по которому будет происходить обработка запроса. Методы класса могут быть декорированы @Get, @Post, @Delete и т д
  Декораторы аргументов:
  @Req() - объект запроса
  @Res() - объект ответа
  -------------------------------------------------
  @Params(key?: string) - строковый параметр
  @Body(key?: string) - тело запроса
  @Query(key?: string) - query параметры запроса
  @Headers(name?: string) - заголовок запроса
  @Session() - сессия пользователя
  Так же в контроллеоах можно:
  реализовывать Wildcard, он реагирует на разные знаки типа ?, +, *, (,);
  Custom HTTP code @HttpCode(204);
  Custom response header @Header('Cache-Control', 'name');
  Перенаправление @Redirect('https://mydomain.com', 301);
  Ограничения по поддомену
  Возврат Promise
  Возврат Observable
  @Res мы можем вернуть объектом res.sendStatus(200)... (Не забываем импортить его из express)

3. Providers
  Провайдер это класс, или значение или фабрика которая позволяет использовать молель неста по внедрению зависимостей и встраивается в друг друга, в контроллеры, в сервисы и выполняет разные функции, будь то чтение из базы данных, или запрос к другим сервисам и т д
  Самый простой пример сервиса обернут декоратором @Injectable()
  export class AppService {
    getHello() {
      return 'Hello World!'
    }
  }
  Для использования такого провайдера нам нужно вставить его в импорт провайдеров в модуле:
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService]
  })
  после этого его можно объявить в конструкторе контроллера:
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService)
  }
  Провайдеры бывают 4 типов:
  useClass, useFactory, useValue, useExisting
  useClass - использование класса в качевстве провайдера.
  useFactory - фабрика с некоторыми доп опциями создает нам класс
  useValue - это конкретно величина которую мы хотим использовать к примеру строка подключения
  useExisting - когда мы хотим переназвать уже существующий провайдер и использовать его с другим псевдонимом
  ---useClass---
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: AppService,
      useClass: AppService
    }]
  })
  ---useValue---
  const myValue = {}

  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: AppService, || 'MY_VALUE'
      useValue: myValue
    }]
  })
  // в контроллере 
  @Controller()
  export class AppController {
    constructor(@Inject('MY_VALUE') myValue: any) { }
  }
  ---useFactory---
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: 'MY_FACTORY',
      useFactory: (otherService: OtherService) => {
        const res = otherService.loadSomething();
        return new CustomFactory(res)
      },
      inject: [OtherService]
    }]
  })
  ---useExisting---
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: 'OtherServiceName',
      useExisting: AppService
    }]
  })
  Типы Scope выполнения:
  1. Default - инстанс провайдера на все приложение (singleton), если например один сервис использут два других сервиса, то один сервис может записывать значения в сервис, а другой их читать, так как инстанс сервиса всегда один и тот же.
  @Injectable()
  2. Request - в данном случае на каждый отдельный запрос к сервису будет сделан его отдельный инстанс, всегда новый. 
  @Injectable({scope: Scope.REQUEST})
  3. Transient - если GenerateService использует у себя service1 и service2, то каждый из этих сервисао получит отдельный инстанс GenerateService
  Пример:
  @Injectable({scope: Scope.TRANSIENT})
  export class GenerateService {
    constructor(private readonly appService: AppService) { }
  }

4. Пайпы - это прослойка между запросом на сервер и обработкой данных, в пайпе можно например валидировать входящие данные, для того что бы использовать валидацию нужно установить пакеты class-transformer class-validator.
После чего нам будут доступны декораторы для валидации dto файлов, для подключения прослойки необходимо в контроллере подключить пайпы через встроенные в nestjs декораторы usePipes(new ValidationPipe()).
В самих же dto файлах используются декораторы которые предоставляют нам пакеты class-transformer и class-validator

5. Debbug - для найстройки нам нужно во вкладке run выбрать add configurations и там поменять поле request: "attach" и добавить порт, после чего командой npm run start:debug запустится debbug режим

6. Для подключения JWT к нашему приложению нужно установить @nestjs/jwt после этого подключить его в модуль:
JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
ConfigModule - отвечает за чтение .env файлов
ConfigService - тоже самое, библиотека для работы с .env
getJWTConfig - наш конфиг который мы написали в отдельном файле
После этого мы сможем в сервисах использовать сущность JwtService, предварительно объявив его в конструкторе

7. Jwt Strategy and Guard - для того что бы сделать jwt стратегию нам нужно установить пакеты: @nestjs/passport, passport, passport-jwt, @types/passport-jwt.
После этого приступаем к написанию файла jwt.strategy.ts в нем все довольно просто, наследуемся от PassportStrategy(Strategy), вызываем super с данными что описаны в файле и делаем один метод validate, после чего пишем наш файл jwt.guard.ts
В нем мы просто наследуемся от AuthGuard и передаем в него строку jwt.
Что бы все заработало нудно подключить все правильно:
auth.module.ts
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Не забываем подключить нашу стратегию в провайдеры
  imports: [
    ConfigModule, // ConfigModule обязательно
    MongooseModule.forFeature([{ name: UserModel.name, schema: AuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    PassportModule, // и конечно же подключаем PassportModule
  ],
})
Теперь можем использовать декоратор @UseGuards(JwtAuthGuard) // тот самый jwt.guard.ts
в любом месте нашего приложения

8. nestjs предоставляет удобный функционал для написания своих декораторов, пример такого можно увидеть в файле user-email.decorator.ts

9. mongodb aggregation - это набор последовательных шагов которые монго может сделать при запросе в базу данных, существует много разных команд про которые можно почитать в оф документации по типу $match, $limit, и т д. Пример анрегации описан в файле product.service.ts

--. Тесты