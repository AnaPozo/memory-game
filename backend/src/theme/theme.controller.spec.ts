import { Test, TestingModule } from '@nestjs/testing';
import { ThemeController } from './theme.controller';
import { CreateThemeDTO } from './dto/theme.dto';
import { ThemeService } from './theme.service';

const themes: CreateThemeDTO[] = [
  {
    name: 'rock bands',
    cards: [
      { name: 'rock band 1', img: 'url' },
      { name: 'rock band 2', img: 'url' },
      { name: 'rock band 3', img: 'url' },
    ],
  },
  {
    name: 'indie bands',
    cards: [
      { name: 'indie band 1', img: 'url' },
      { name: 'indie band 2', img: 'url' },
      { name: 'indie band 3', img: 'url' },
    ],
  },
];

describe('ThemeController', () => {
  let controller: ThemeController;
  const mockThemeService = {
    findAll: jest.fn().mockImplementation(() => Promise.resolve({ themes })),
    create: jest.fn().mockImplementation((theme) => {
      const newThemes = {
        id: 2,
        ...theme,
      };
      themes.push(newThemes);
      return Promise.resolve(newThemes);
    }),
    findOne: jest.fn().mockImplementation((name) => {
      const foundTheme = themes.find((theme) => theme.name === name);
      return Promise.resolve(foundTheme);
    }),
    update: jest.fn().mockImplementation((name, updatedData) => {
      const foundIndex: any = themes.find((theme) => theme.name === name);
      const updatedTheme = {
        ...themes[foundIndex],
        ...updatedData,
      };
      themes[foundIndex] = updatedTheme;
      return Promise.resolve(updatedTheme);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeController],
      providers: [ThemeService],
    })
      .overrideProvider(ThemeService)
      .useValue(mockThemeService)
      .compile();

    controller = module.get<ThemeController>(ThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a themes list', async () => {
    expect(await controller.findAll()).toMatchObject({ themes });
  });

  it('should create a theme and return the theme created', async () => {
    const newTheme = {
      name: 'salsa bands',
      cards: [
        { name: 'salsa band 1', img: 'url' },
        { name: 'salsa band 2', img: 'url' },
        { name: 'salsa band 3', img: 'url' },
      ],
    };
    expect(await controller.create(newTheme)).toMatchObject({
      id: expect.any(Number),
    });
  });

  it('should return an specific theme', async () => {
    expect(await controller.findOne('rock bands')).toMatchObject({
      name: 'rock bands',
      cards: [
        { name: 'rock band 1', img: 'url' },
        { name: 'rock band 2', img: 'url' },
        { name: 'rock band 3', img: 'url' },
      ],
    });
  });

  it('should update a theme and return the theme updated', async () => {
    const updatedTheme = {
      name: 'indie bands UPDATED',
      cards: [
        { name: 'indie band 1', img: 'url' },
        { name: 'indie band 2', img: 'url' },
        { name: 'indie band 3', img: 'url' },
      ],
    };
    expect(await controller.update('indie bands', updatedTheme)).toMatchObject(
      updatedTheme,
    );
  });
});
