import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { PhotoCamera } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { carListingSchema } from '../../common/utils/zod-validation';
import { useAddNotification } from '../../components/notifications/NotificationSystem';
import { getModelsForBrand } from '../../models/car-models';
import { useAddVehicleImageMutation, useCreateVehicleMutation } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';
import { routes } from '../../routes';

const brands = [
  'Acura',
  'Alfa Romeo',
  'Aston Martin',
  'Audi',
  'Bentley',
  'BMW',
  'Bugatti',
  'Buick',
  'Cadillac',
  'Chevrolet',
  'Chrysler',
  'Citroën',
  'Dacia',
  'Daewoo',
  'Daihatsu',
  'Dodge',
  'Ferrari',
  'Fiat',
  'Ford',
  'Genesis',
  'Honda',
  'Hummer',
  'Hyundai',
  'Infiniti',
  'Jaguar',
  'Jeep',
  'Kia',
  'Lamborghini',
  'Lancia',
  'Land Rover',
  'Lexus',
  'Lincoln',
  'Lotus',
  'Maserati',
  'Maybach',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  'Mini',
  'Mitsubishi',
  'Morgan',
  'Nissan',
  'Opel',
  'Peugeot',
  'Pontiac',
  'Porsche',
  'Renault',
  'Rolls-Royce',
  'Saab',
  'Seat',
  'Skoda',
  'Smart',
  'Subaru',
  'Suzuki',
  'Tesla',
  'Toyota',
  'Vauxhall',
  'Volkswagen',
  'Volvo',
  'ZAZ',
  'ВАЗ (Lada)',
  'ГАЗ',
  'УАЗ',
];

const fuels = ['petrol', 'diesel', 'electric', 'hybrid', 'gas', 'other'];
const transmissions = ['manual', 'automatic', 'cvt', 'robotic', 'other'];
const bodyTypes = ['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'pickup', 'van', 'minivan'];
const driveTypes = ['front', 'rear', 'all', 'full'];
const colors = [
  'black',
  'white',
  'gray',
  'red',
  'blue',
  'green',
  'silver',
  'beige',
  'brown',
  'yellow',
  'orange',
  'purple',
  'other',
];
const currencies = ['USD', 'EUR', 'UAH'];
const vehicleTypes = ['Легковий автомобіль', 'Мотоцикл', 'Вантажний автомобіль', 'Автобус', 'Спецтехніка', 'Причіп'];

// Додаткові масиви для характеристик
const engineVolumes = [
  '1.0',
  '1.1',
  '1.2',
  '1.3',
  '1.4',
  '1.5',
  '1.6',
  '1.7',
  '1.8',
  '1.9',
  '2.0',
  '2.1',
  '2.2',
  '2.3',
  '2.4',
  '2.5',
  '2.6',
  '2.7',
  '2.8',
  '2.9',
  '3.0',
  '3.5',
  '4.0',
  '4.5',
  '5.0',
  '5.5',
  '6.0',
  '6.5',
  '7.0',
  '8.0',
];

const ecoStandards = ['Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'Euro 6d'];

const doorCounts = ['2', '3', '4', '5'];

const importedFrom = [
  'Німеччина',
  'США',
  'Канада',
  'Корея',
  'Японія',
  'Франція',
  'Італія',
  'Великобританія',
  'Швеція',
  'Нідерланди',
  'Бельгія',
  'Австрія',
  'Швейцарія',
  'Чехія',
  'Польща',
  'Литва',
  'Латвія',
  'Естонія',
  'Грузія',
  'Інша країна',
];

const seatCounts = ['1', '2', '3', '4', '5', '6', '7', '8', '9+'];

const paintTypes = ['Металік', 'Перламутр', 'Матовий', 'Звичайний'];

const technicalConditions = ['Відмінний', 'Хороший', 'Задовільний', 'Потребує ремонту', 'Не на ходу'];

const accidentHistory = ['Не була в ДТП', 'Була в ДТП'];

const regions = [
  'Київ',
  'Київська',
  'Харків',
  'Харківська',
  'Одеса',
  'Одеська',
  'Дніпро',
  'Дніпропетровська',
  'Донецька',
  'Запорізька',
  'Львів',
  'Львівська',
  'Кривий Ріг',
  'Миколаїв',
  'Миколаївська',
  'Маріуполь',
  'Луганська',
  'Вінниця',
  'Вінницька',
  'Макіївка',
  'Сімферополь',
  'Херсон',
  'Херсонська',
  'Полтава',
  'Полтавська',
  'Чернігів',
  'Чернігівська',
  'Черкаси',
  'Черкаська',
  'Житомир',
  'Житомирська',
  'Суми',
  'Сумська',
  'Хмельницький',
  'Хмельницька',
  'Чернівці',
  'Чернівецька',
  'Рівне',
  'Рівненська',
  'Кропивницький',
  'Кіровоградська',
  'Івано-Франківськ',
  'Івано-Франківська',
  'Кременчук',
  'Тернопіль',
  'Тернопільська',
  'Луцьк',
  'Волинська',
  'Біла Церква',
  'Краматорськ',
  'Мелітополь',
  'Керч',
  'Нікополь',
  'Бердянськ',
  "Слов'янськ",
  'Ужгород',
  'Закарпатська',
  'Алчевськ',
  'Павлоград',
  'Сєвєродонецьк',
  'Євпаторія',
  'Лисичанськ',
  "Кам'янське",
  'Бровари',
  'Дрогобич',
  'Конотоп',
  'Умань',
  'Мукачево',
  'Ялта',
  'Бахмут',
];

// Додаткові опції
const interiorMaterials = ['Тканина', 'Шкіра', 'Комбінована', 'Алькантара', 'Велюр'];
const interiorColors = ['Чорний', 'Сірий', 'Бежевий', 'Коричневий', 'Білий', 'Інший'];
const steeringTypes = ['Гідропідсилювач', 'Електропідсилювач', 'Без підсилення'];
const seatAdjustments = ['Механічне', 'Електричне', 'Комбіноване'];
const seatVentilation = ['Передні', 'Задні', 'Передні і задні', 'Немає'];
const seatHeating = ['Передні', 'Задні', 'Передні і задні', 'Немає'];
const seatMemory = ['Водія', 'Пасажира', 'Обидва', 'Немає'];
const steeringAdjustment = ['По висоті', 'По вильоту', 'По висоті та вильоту'];
const headlightTypes = ['Галогенні', 'Ксенонові', 'LED', 'Лазерні'];
const airConditioningTypes = [
  'Кондиціонер',
  'Клімат-контроль',
  'Двозонний клімат',
  'Тризонний клімат',
  'Чотиризонний клімат',
];
const powerWindowTypes = ['Передні', 'Задні', 'Всі'];
const spareWheelTypes = ['Повнорозмірне', 'Малорозмірне (докатка)', 'Ремкомплект', 'Немає'];

const MAX_IMAGES = 8;

const inputSx = {
  bgcolor: '#fff',
  borderRadius: 1,
  fontSize: 15,
  height: 40,
  '.MuiInputBase-input': { py: 1, px: 1.5, fontSize: 15 },
  '.MuiSelect-select': { py: 1, px: 1.5, fontSize: 15, height: 'auto' },
};

const labelSx = {
  fontSize: 15,
};

const vinInputSx = {
  bgcolor: '#fff',
  borderRadius: 1,
  fontSize: 15,
  height: 40,
  width: '66%', // 1.5 рази ширше за стандартне поле (4/6 від Grid)
  '.MuiInputBase-input': { py: 1, px: 1.5, fontSize: 15 },
  mr: 1,
};

const sectionSx = {
  mb: 4,
  borderRadius: 2,
  p: 3,
  background: 'transparent', // прибрано фон
};

const vinSectionSx = {
  mb: 4,
  p: 3,
  backgroundColor: 'white', // тільки тут білий фон
  borderRadius: 2,
  border: '1px solid #e0e0e0',
};

const hrSx = {
  border: 0,
  borderTop: '1px solid #e0e0e0',
  my: 4,
};

const yellowBoxSx = {
  background: '#fff9db',
  border: '1px solid #ffe58f',
  borderRadius: 1,
  p: 2,
  mb: 2,
};

const infoIconSx = {
  display: 'inline-block',
  width: 18,
  height: 18,
  borderRadius: '50%',
  bgcolor: '#bdb76b',
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  textAlign: 'center',
  lineHeight: '18px',
  mr: 1,
};

// const characteristicsFields = [
//   { name: 'transmission', label: 'Коробка передач', type: 'select', options: transmissions },
//   { name: 'fuel_type', label: 'Паливо', type: 'select', options: fuels },
//   { name: 'engine_volume', label: "Об'єм двигуна, л.", type: 'select', options: ['Оберіть'] },
//   { name: 'engine_power', label: 'Потужність двигуна', type: 'input', unit: 'к.с.' },
//   { name: 'fuel_consumption_city', label: 'Витрати палива (місто)', type: 'input' },
//   { name: 'fuel_consumption_highway', label: 'Витрати палива (шосе)', type: 'input' },
//   { name: 'eco_standard', label: 'Екологічний стандарт', type: 'select', options: ['Оберіть'] },
//   { name: 'drive_type', label: 'Привід', type: 'select', options: driveTypes },
//   { name: 'color', label: 'Колір', type: 'select', options: ['Оберіть'] },
//   { name: 'doors', label: 'Кількість дверей', type: 'select', options: ['Оберіть'] },
//   { name: 'imported_from', label: 'Пригнаний з', type: 'select', options: ['Оберіть'] },
//   { name: 'seats', label: 'Кількість місць', type: 'select', options: ['Оберіть'] },
//   { name: 'paint', label: 'Лакофарбове покриття', type: 'select', options: ['Оберіть'] },
//   { name: 'technical_condition', label: 'Технічний стан', type: 'select', options: ['Оберіть'] },
//   { name: 'accident', label: 'Участь в ДТП', type: 'select', options: ['Оберіть'] },
// ];

const CreateListingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [images, setImages] = useState<(File | null)[]>(Array(MAX_IMAGES).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(Array(MAX_IMAGES).fill(null));
  const [isOwner, setIsOwner] = useState(false);
  const [agree, setAgree] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const { notifyNewVehicle } = useAddNotification();

  // Перевірка авторизації
  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate(routes.LOGIN);
      }, 2000);
    }
  }, [user, navigate]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carListingSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: 0,
      price: 0,
      currency: 'USD',
      description: '',
      location: '',
      mileage: 0,
      fuel_type: undefined,
      transmission: undefined,
      body_type: undefined,
      drive_type: undefined,
      is_new: 'true',
      plate_number: '',
      color: undefined,
      engine_volume: 0,
      engine_power: 0,
      vin_code: '',
    },
  });

  // Відстежуємо зміни поля brand для оновлення моделей
  const selectedBrand = watch('brand');

  useEffect(() => {
    if (selectedBrand) {
      const models = getModelsForBrand(selectedBrand);
      setAvailableModels(models);
      // Скидаємо обрану модель при зміні марки
      setValue('model', '');
    } else {
      setAvailableModels([]);
    }
  }, [selectedBrand, setValue]);

  // Додаємо обробник для кожної ячейки
  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => {
          const arr = [...prev];
          arr[index] = reader.result as string;
          return arr;
        });
      };
      reader.readAsDataURL(file);
      setImages((prev) => {
        const arr = [...prev];
        arr[index] = file;
        return arr;
      });
    } else {
      setPreviews((prev) => {
        const arr = [...prev];
        arr[index] = null;
        return arr;
      });
      setImages((prev) => {
        const arr = [...prev];
        arr[index] = null;
        return arr;
      });
    }
  };

  const onError = (errors: any) => {
    console.error('Validation errors:', errors);
  };

  const onSubmit = async (data: any) => {
    try {
      // Отримуємо тип транспорту з форми
      const form = document.getElementById('create-listing-form') as HTMLFormElement;
      const vehicleTypeSelect = form.elements.namedItem('vehicle_type') as HTMLSelectElement;
      const vehicle_type = vehicleTypeSelect?.value || 'Легковий автомобіль';

      // Мапінг українських назв на значення з бази
      const vehicleTypeMapping: Record<string, string> = {
        'Легковий автомобіль': 'car',
        Мотоцикл: 'motorcycle',
        'Вантажний автомобіль': 'truck',
        Автобус: 'bus',
        Спецтехніка: 'specialtech',
        Причіп: 'trailer',
      };

      const newVehicle = {
        vehicle_type: (vehicleTypeMapping[vehicle_type] || 'car') as
          | 'car'
          | 'motorcycle'
          | 'truck'
          | 'bus'
          | 'specialtech'
          | 'trailer'
          | 'watertransport'
          | 'airtransport'
          | 'motorhome',
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year),
        price: parseFloat(data.price),
        currency: data.currency,
        description: data.description,
        location: data.location || undefined,
        mileage: data.mileage ? parseInt(data.mileage) : undefined,
        fuel_type: data.fuel_type || undefined,
        transmission: data.transmission || undefined,
        body_type: data.body_type || undefined,
        drive_type: data.drive_type || undefined,
        is_new: data.is_new === 'true' ? true : data.is_new === 'false' ? false : Boolean(data.is_new),
        plate_number: data.plate_number || undefined,
        color: data.color || undefined,
        engine_volume: data.engine_volume && data.engine_volume !== '' ? parseFloat(data.engine_volume) : undefined,
        engine_power: data.engine_power ? parseInt(data.engine_power) : undefined,
        vin_code: data.vin_code || undefined,
      };

      console.log('Відправляємо дані на сервер:', newVehicle);
      const vehicle = await createVehicle(newVehicle).unwrap();
      console.log('Оголошення створено:', vehicle);

      // Додаємо нотифікацію про створення оголошення
      const vehicleTitle = `${data.brand} ${data.model} ${data.year}`;
      notifyNewVehicle(vehicleTitle, vehicle.id);

      // Завантаження всіх зображень
      const imageUploadPromises = images
        .filter((image): image is File => image !== null) // Фільтруємо тільки дійсні файли
        .map((image) => {
          if (vehicle.id) {
            return addVehicleImage({ vehicleId: vehicle.id, image }).unwrap();
          }
          return Promise.reject('Vehicle ID is undefined');
        });

      try {
        await Promise.all(imageUploadPromises);
        console.log('Всі зображення успішно завантажено');
      } catch (imageError) {
        console.error('Помилка при завантаженні зображень:', imageError);
      }

      navigate(routes.HOME);
    } catch (error: any) {
      console.error('Помилка при створенні оголошення:', error);
    }
  };

  return (
    <Box sx={{ py: 3, overflowX: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }} component="form" id="create-listing-form">
          {/* Breadcrumbs */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Turbosell {'>'} Створення оголошення
          </Typography>

          {/* Заголовок */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Створення оголошення
          </Typography>

          {/* --- Основна інформація --- */}
          <Box sx={sectionSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Основна інформація
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: '#eaf2ff',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: 15,
                  color: '#156ff5',
                  mr: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: '#156ff5',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: '18px',
                    mr: 1,
                  }}
                >
                  i
                </Box>
                Заповнення цих полів є обов'язковим
              </Box>
            </Box>
            <Grid container spacing={1.5}>
              {/* Тип транспорту */}
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={labelSx}>Тип транспорту</InputLabel>
                  <Select name="vehicle_type" defaultValue={vehicleTypes[0]} label="Тип транспорту" sx={inputSx}>
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Марка */}
              <Grid item xs={4}>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.brand}>
                      <InputLabel sx={labelSx}>Марка</InputLabel>
                      <Select {...field} label="Марка" sx={inputSx}>
                        {brands.map((b) => (
                          <MenuItem key={b} value={b}>
                            {b}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.brand && (
                        <Typography variant="caption" color="error">
                          {errors.brand.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Модель */}
              <Grid item xs={4}>
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.model}>
                      <InputLabel sx={labelSx}>Модель</InputLabel>
                      <Select {...field} label="Модель" sx={inputSx} disabled={!availableModels.length}>
                        <MenuItem value="">
                          <em>{availableModels.length ? 'Оберіть модель' : 'Спочатку оберіть марку'}</em>
                        </MenuItem>
                        {availableModels.map((model) => (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.model && (
                        <Typography variant="caption" color="error">
                          {errors.model.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Рік */}
              <Grid item xs={4}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Рік"
                      placeholder="Оберіть"
                      type="number"
                      error={!!errors.year}
                      helperText={errors.year?.message}
                      sx={inputSx}
                      InputLabelProps={{ sx: labelSx }}
                    />
                  )}
                />
              </Grid>
              {/* Пробіг */}
              <Grid item xs={4}>
                <Controller
                  name="mileage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Пробіг"
                      placeholder="тис.км"
                      type="number"
                      error={!!errors.mileage}
                      helperText={errors.mileage?.message}
                      sx={inputSx}
                      InputLabelProps={{ sx: labelSx }}
                    />
                  )}
                />
              </Grid>
              {/* Тип кузова */}
              <Grid item xs={4}>
                <Controller
                  name="body_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel sx={labelSx}>Тип кузова</InputLabel>
                      <Select {...field} label="Тип кузова" sx={inputSx}>
                        {bodyTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Регіон */}
              <Grid item xs={4}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.location}>
                      <InputLabel sx={labelSx}>Регіон</InputLabel>
                      <Select {...field} label="Регіон" sx={inputSx}>
                        <MenuItem value="">
                          <em>Оберіть</em>
                        </MenuItem>
                        {regions.map((region) => (
                          <MenuItem key={region} value={region}>
                            {region}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.location && (
                        <Typography variant="caption" color="error">
                          {errors.location.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Місто */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Місто"
                  placeholder="Оберіть"
                  sx={inputSx}
                  InputLabelProps={{ sx: labelSx }}
                />
              </Grid>
              {/* Номер авто */}
              <Grid item xs={4}>
                <Controller
                  name="plate_number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Номер авто"
                      placeholder="AA1234BB"
                      error={!!errors.plate_number}
                      helperText={errors.plate_number?.message}
                      sx={inputSx}
                      InputLabelProps={{ sx: labelSx }}
                    />
                  )}
                />
              </Grid>
              {/* Коробка передач */}
              <Grid item xs={4}>
                <Controller
                  name="transmission"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.transmission}>
                      <InputLabel sx={labelSx}>Коробка передач</InputLabel>
                      <Select {...field} label="Коробка передач" sx={inputSx}>
                        <MenuItem value="">
                          <em>Оберіть</em>
                        </MenuItem>
                        {transmissions.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.transmission && (
                        <Typography variant="caption" color="error">
                          {errors.transmission.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Привід */}
              <Grid item xs={4}>
                <Controller
                  name="drive_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.drive_type}>
                      <InputLabel sx={labelSx}>Привід</InputLabel>
                      <Select {...field} label="Привід" sx={inputSx}>
                        <MenuItem value="">
                          <em>Оберіть</em>
                        </MenuItem>
                        {driveTypes.map((d) => (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.drive_type && (
                        <Typography variant="caption" color="error">
                          {errors.drive_type.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Стан */}
              <Grid item xs={4}>
                <Controller
                  name="is_new"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel sx={labelSx}>Стан</InputLabel>
                      <Select {...field} label="Стан" sx={inputSx}>
                        <MenuItem value="true">Нова</MenuItem>
                        <MenuItem value="false">Б/У</MenuItem>
                      </Select>
                      {errors.is_new && (
                        <Typography variant="caption" color="error">
                          {errors.is_new.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Ціна та валюта */}
              <Grid item xs={4}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Ціна"
                      placeholder="Оберіть"
                      type="number"
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      sx={inputSx}
                      InputLabelProps={{ sx: labelSx }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel sx={labelSx}>Валюта</InputLabel>
                      <Select {...field} label="Валюта" sx={inputSx}>
                        {currencies.map((currency) => (
                          <MenuItem key={currency} value={currency}>
                            {currency}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6} />
            </Grid>
          </Box>

          {/* --- VIN код --- */}
          <Box sx={vinSectionSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Перевірені VIN–коди підвищують шанси на швидкий продаж.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Автоматична безкоштовна перевірка авто за державними та дилерськими реєстрами підвищує рейтинг оголошення
              в пошуку.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Controller
                name="vin_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="VIN–код"
                    placeholder="VIN"
                    size="small"
                    sx={vinInputSx}
                    InputLabelProps={{ sx: labelSx }}
                    error={!!errors.vin_code}
                    helperText={errors.vin_code?.message}
                  />
                )}
              />
              <Button
                variant="outlined"
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 1,
                  ml: 1,
                  p: 0,
                  borderColor: '#bdbdbd',
                  color: '#757575',
                }}
                tabIndex={-1}
              >
                <PhotoCamera sx={{ fontSize: 22 }} />
              </Button>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Ви власник авто?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Вказуйте, що ви власник — це приваблює більше покупців.
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={isOwner} onChange={(e) => setIsOwner(e.target.checked)} size="small" />}
              label={<Typography sx={{ fontSize: 15 }}>Я власник авто</Typography>}
            />
          </Box>

          {/* --- Горизонтальна лінія після VIN --- */}
          <Box component="hr" sx={hrSx} />

          {/* --- Фото --- */}
          <Box sx={sectionSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Додайте 2-3 фото з відкритим держ. номером
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: '#f5f7fa',
                  borderRadius: 1,
                  px: 1,
                  py: 0.2,
                  fontSize: 14,
                  color: '#156ff5',
                  mr: 1,
                }}
              >
                Перше фото буде на обкладинці оголошення.
              </Box>
            </Typography>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <Grid item xs={3} key={idx}>
                  <Box
                    sx={{
                      bgcolor: '#e5e5e5',
                      borderRadius: 1,
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      border: '1px dashed #bdbdbd',
                      overflow: 'hidden',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        cursor: 'pointer',
                      }}
                      onChange={handleImageChange(idx)}
                    />
                    {previews[idx] ? (
                      <img
                        src={previews[idx]!}
                        alt={`Фото ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color: '#757575',
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontSize: 14 }}>
                          Додати фото
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline', fontSize: 15 }}
                component="a"
                href="#"
              >
                Як фотографувати автомобіль
              </Typography>
            </Box>
            {/* --- Відео --- */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Посилання на відеоролик (необов'язково)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <TextField fullWidth placeholder="Посилання" size="small" sx={{ bgcolor: '#fff' }} />
                <Button variant="contained" sx={{ minWidth: 120 }}>
                  Завантажити
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Скопіюйте сюди посилання на відео з сайту{' '}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  youtube.com
                </a>
                .
              </Typography>
            </Box>
          </Box>

          {/* --- Горизонтальна лінія після фото --- */}
          <Box component="hr" sx={hrSx} />

          {/* --- Опис автомобіля --- */}
          <Box sx={sectionSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Опис автомобіля
            </Typography>
            <Box sx={yellowBoxSx}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                в даному полі забороняється
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box sx={infoIconSx}>i</Box>
                <Typography variant="body2">Залишати посилання або контактні дані</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={infoIconSx}>i</Box>
                <Typography variant="body2">
                  Пропонувати послуги (прожену під замовлення, є інші авто, допоможу вибрати)
                </Typography>
              </Box>
            </Box>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Опис"
                  multiline
                  rows={6}
                  inputProps={{ maxLength: 2000 }}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 1,
                    fontSize: 15,
                  }}
                  helperText={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Доступно 2000 символів</span>
                      <span>{field.value?.length || 0}/2000</span>
                    </Box>
                  }
                />
              )}
            />
          </Box>

          {/* --- Горизонтальна лінія після опису --- */}
          <Box component="hr" sx={hrSx} />

          {/* --- Характеристики авто --- */}
          <Box sx={sectionSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Характеристики авто
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Controller
                  name="fuel_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Паливо</InputLabel>
                      <Select {...field} label="Паливо">
                        <MenuItem value="">
                          <em>Оберіть</em>
                        </MenuItem>
                        {fuels.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Об'єм двигуна */}
              <Grid item xs={3}>
                <Controller
                  name="engine_volume"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.engine_volume}>
                      <InputLabel>Об'єм двигуна, л.</InputLabel>
                      <Select {...field} label="Об'єм двигуна, л.">
                        <MenuItem value="">
                          <em>Оберіть</em>
                        </MenuItem>
                        {engineVolumes.map((volume) => (
                          <MenuItem key={volume} value={volume}>
                            {volume}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.engine_volume && (
                        <Typography variant="caption" color="error">
                          {errors.engine_volume.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Потужність двигуна */}
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Controller
                    name="engine_power"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        label="Потужність двигуна"
                        placeholder="Оберіть"
                        type="number"
                        error={!!errors.engine_power}
                        helperText={errors.engine_power?.message}
                      />
                    )}
                  />
                  <Typography sx={{ ml: 1, fontSize: 15, color: '#757575' }}>к.с.</Typography>
                </Box>
              </Grid>
              {/* Витрати палива місто */}
              <Grid item xs={3}>
                <TextField
                  name="fuel_consumption_city"
                  fullWidth
                  size="small"
                  label="Витрати палива (місто)"
                  placeholder="л/100км"
                />
              </Grid>
              {/* Витрати палива шосе */}
              <Grid item xs={3}>
                <TextField
                  name="fuel_consumption_highway"
                  fullWidth
                  size="small"
                  label="Витрати палива (шосе)"
                  placeholder="л/100км"
                />
              </Grid>
              {/* Екологічний стандарт */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Екологічний стандарт</InputLabel>
                  <Select name="eco_standard" label="Екологічний стандарт">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {ecoStandards.map((standard) => (
                      <MenuItem key={standard} value={standard}>
                        {standard}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Колір */}
              <Grid item xs={3}>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.color}>
                      <InputLabel>Колір</InputLabel>
                      <Select {...field} label="Колір">
                        <MenuItem value="">
                          <em>Оберіть</em>
                        </MenuItem>
                        {colors.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.color && (
                        <Typography variant="caption" color="error">
                          {errors.color.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Кількість дверей */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Кількість дверей</InputLabel>
                  <Select name="doors" label="Кількість дверей">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {doorCounts.map((count) => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Пригнаний з */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Пригнаний з</InputLabel>
                  <Select name="imported_from" label="Пригнаний з">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {importedFrom.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Кількість місць */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Кількість місць</InputLabel>
                  <Select name="seats" label="Кількість місць">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {seatCounts.map((count) => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Лакофарбове покриття */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Лакофарбове покриття</InputLabel>
                  <Select name="paint" label="Лакофарбове покриття">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {paintTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Технічний стан */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Технічний стан</InputLabel>
                  <Select name="technical_condition" label="Технічний стан">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {technicalConditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Участь в ДТП */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Участь в ДТП</InputLabel>
                  <Select name="accident" label="Участь в ДТП">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {accidentHistory.map((history) => (
                      <MenuItem key={history} value={history}>
                        {history}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* --- Додаткові опції --- */}
          <Box sx={sectionSx}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Додаткові опції
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Селекти для додаткових опцій */}
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Матеріал салону</InputLabel>
                  <Select name="interior_material" label="Матеріал салону">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {interiorMaterials.map((material) => (
                      <MenuItem key={material} value={material}>
                        {material}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Колір салону</InputLabel>
                  <Select name="interior_color" label="Колір салону">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {interiorColors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Підсилювач керма</InputLabel>
                  <Select name="steering_wheel_heater" label="Підсилювач керма">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {steeringTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Регулювання сидінь салону</InputLabel>
                  <Select name="seat_adjustment" label="Регулювання сидінь салону">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {seatAdjustments.map((adjustment) => (
                      <MenuItem key={adjustment} value={adjustment}>
                        {adjustment}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Вентиляція сидінь</InputLabel>
                  <Select name="seat_ventilation" label="Вентиляція сидінь">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {seatVentilation.map((ventilation) => (
                      <MenuItem key={ventilation} value={ventilation}>
                        {ventilation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Підігрів сидінь</InputLabel>
                  <Select name="seat_heating" label="Підігрів сидінь">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {seatHeating.map((heating) => (
                      <MenuItem key={heating} value={heating}>
                        {heating}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Пам'ять положення сидіння</InputLabel>
                  <Select name="seat_memory" label="Пам'ять положення сидіння">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {seatMemory.map((memory) => (
                      <MenuItem key={memory} value={memory}>
                        {memory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Регулювання керма</InputLabel>
                  <Select name="steering_adjustment" label="Регулювання керма">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {steeringAdjustment.map((adjustment) => (
                      <MenuItem key={adjustment} value={adjustment}>
                        {adjustment}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Фари</InputLabel>
                  <Select name="headlights" label="Фари">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {headlightTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Кондиціонер</InputLabel>
                  <Select name="air_conditioning" label="Кондиціонер">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {airConditioningTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Електросклопідйомники</InputLabel>
                  <Select name="power_windows" label="Електросклопідйомники">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {powerWindowTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Запасне колесо</InputLabel>
                  <Select name="spare_wheel" label="Запасне колесо">
                    <MenuItem value="">
                      <em>Оберіть</em>
                    </MenuItem>
                    {spareWheelTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Чекбокси для додаткових опцій */}
            <Grid container spacing={2}>
              {/* Салон та комфорт */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Салон та комфорт</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Checkbox name="onboard_computer" size="small" />}
                    label="Бортовий комп'ютер"
                  />
                  <FormControlLabel
                    control={<Checkbox name="mirror_heating" size="small" />}
                    label="Підігрів дзеркал"
                  />
                  <FormControlLabel control={<Checkbox name="cruise_control" size="small" />} label="Круїз контроль" />
                  <FormControlLabel
                    control={<Checkbox name="power_mirrors" size="small" />}
                    label="Електропривід дзеркал"
                  />
                  <FormControlLabel control={<Checkbox name="tinted_windows" size="small" />} label="Тоновані вікна" />
                </Box>
              </Grid>
              {/* Оптика */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Оптика</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel control={<Checkbox name="fog_lights" size="small" />} label="Протитуманні фари" />
                  <FormControlLabel control={<Checkbox name="light_sensors" size="small" />} label="Датчики світла" />
                  <FormControlLabel
                    control={<Checkbox name="daytime_lights" size="small" />}
                    label="Денні ходові вогні"
                  />
                  <FormControlLabel control={<Checkbox name="headlight_washers" size="small" />} label="Омивач фар" />
                  <FormControlLabel
                    control={<Checkbox name="adaptive_lighting" size="small" />}
                    label="Система адаптивного освітлення"
                  />
                </Box>
              </Grid>
              {/* Кузов */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Кузов</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Checkbox name="engine_protection" size="small" />}
                    label="Захист картера"
                  />
                  <FormControlLabel control={<Checkbox name="trailer_hitch" size="small" />} label="Фаркоп" />
                  <FormControlLabel
                    control={<Checkbox name="gearbox_protection" size="small" />}
                    label="Захист коробки"
                  />
                  <FormControlLabel control={<Checkbox name="sill_plates" size="small" />} label="Накладки на пороги" />
                  <FormControlLabel control={<Checkbox name="long_wheelbase" size="small" />} label="Довга база" />
                  <FormControlLabel control={<Checkbox name="euro6" size="small" />} label="Євро-6" />
                </Box>
              </Grid>
              {/* Система допомоги паркуванню */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Система допомоги паркуванню</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Checkbox name="rear_parking_sensors" size="small" />}
                    label="Парктронік задній"
                  />
                  <FormControlLabel control={<Checkbox name="rear_camera" size="small" />} label="Задня камера" />
                  <FormControlLabel
                    control={<Checkbox name="front_parking_sensors" size="small" />}
                    label="Парктронік передній"
                  />
                  <FormControlLabel control={<Checkbox name="front_camera" size="small" />} label="Передня камера" />
                  <FormControlLabel control={<Checkbox name="camera_360" size="small" />} label="Камера 360" />
                </Box>
              </Grid>
              {/* Безпека */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Безпека</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Checkbox name="abs" size="small" />}
                    label="Антиблокувальна система(ABS)"
                  />
                  <FormControlLabel
                    control={<Checkbox name="central_locking" size="small" />}
                    label="Центральний замок"
                  />
                  <FormControlLabel
                    control={<Checkbox name="rear_door_locks" size="small" />}
                    label="Блокування задніх замків дверей"
                  />
                  <FormControlLabel
                    control={<Checkbox name="traction_control" size="small" />}
                    label="Антипробуксовочна система (ARS)"
                  />
                  <FormControlLabel control={<Checkbox name="esp" size="small" />} label="Система стабілізації (ESP)" />
                </Box>
              </Grid>
              {/* Подушки безпеки */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Подушки безпеки</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel control={<Checkbox name="driver_airbag" size="small" />} label="Водія" />
                  <FormControlLabel control={<Checkbox name="passenger_airbag" size="small" />} label="Пасажира" />
                  <FormControlLabel
                    control={<Checkbox name="side_front_airbags" size="small" />}
                    label="Бічні передні"
                  />
                  <FormControlLabel control={<Checkbox name="side_rear_airbags" size="small" />} label="Бічні задні" />
                  <FormControlLabel control={<Checkbox name="window_curtains" size="small" />} label="Віконні шторки" />
                </Box>
              </Grid>
              {/* Мультимедіа */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Мультимедіа</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel control={<Checkbox name="aux" size="small" />} label="AUX" />
                  <FormControlLabel control={<Checkbox name="usb" size="small" />} label="USB" />
                  <FormControlLabel control={<Checkbox name="bluetooth" size="small" />} label="Bluetooth" />
                  <FormControlLabel control={<Checkbox name="audio_system" size="small" />} label="Акустика" />
                  <FormControlLabel
                    control={<Checkbox name="navigation_system" size="small" />}
                    label="Навігаційна система"
                  />
                </Box>
              </Grid>
              {/* Стан */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Стан</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Checkbox name="garage_storage" size="small" />}
                    label="Гаражне зберігання"
                  />
                  <FormControlLabel control={<Checkbox name="service_book" size="small" />} label="Сервісна книжка" />
                  <FormControlLabel control={<Checkbox name="first_owner" size="small" />} label="Перший власник" />
                  <FormControlLabel
                    control={<Checkbox name="first_registration" size="small" />}
                    label="Перша реєстрація"
                  />
                  <FormControlLabel control={<Checkbox name="car_on_loan" size="small" />} label="Авто в кредиті" />
                </Box>
              </Grid>
              {/* Додаткове обладнання */}
              <Grid item xs={4}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Додаткове обладнання</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Checkbox name="lpg" size="small" />}
                    label="Газобалонне обладнання (ГБО)"
                  />
                  <FormControlLabel
                    control={<Checkbox name="webasto" size="small" />}
                    label="Автоматичний обігрівач webasto"
                  />
                  <FormControlLabel control={<Checkbox name="air_suspension" size="small" />} label="Пневмопідвіска" />
                  <FormControlLabel
                    control={<Checkbox name="hand_controls" size="small" />}
                    label="Ручне керування для людей з інвалідністю"
                  />
                  <FormControlLabel
                    control={<Checkbox name="ramp" size="small" />}
                    label="Пандус для людей з інвалідністю"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* --- Угода та кнопка --- */}
          <Box sx={{ mt: 4 }}>
            <FormControlLabel
              control={<Checkbox color="primary" checked={agree} onChange={(e) => setAgree(e.target.checked)} />}
              label={
                <Typography variant="body2" color="text.secondary">
                  я згоден з умовами{' '}
                  <a href="/terms" style={{ color: '#156ff5' }} target="_blank" rel="noopener noreferrer">
                    Угода про надання послуг
                  </a>
                </Typography>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              Ваші персональні дані будуть оброблені та захищені згідно з{' '}
              <a href="/privacy" style={{ color: '#156ff5' }} target="_blank" rel="noopener noreferrer">
                Політикою приватності
              </a>
            </Typography>
            <Stack direction="row" justifyContent="flex-start">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!agree}
                sx={{
                  bgcolor: !agree ? '#bdbdbd' : undefined,
                  color: !agree ? '#fff' : undefined,
                  boxShadow: 'none',
                  minWidth: 220,
                  fontWeight: 500,
                  fontSize: 16,
                  textTransform: 'none',
                }}
                onClick={handleSubmit(onSubmit, onError)}
              >
                Розмістити оголошення
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateListingPage;
