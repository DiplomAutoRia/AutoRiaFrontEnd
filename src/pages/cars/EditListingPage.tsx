import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

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
import { useAddVehicleImageMutation, useGetVehicleQuery, useUpdateVehicleMutation } from '../../redux/api/vehiclesApi';
import { routes } from '../../routes';

const brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda'];
const transmissions = ['manual', 'automatic', 'cvt', 'robotic', 'other'];
const bodyTypes = ['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'pickup', 'van', 'minivan'];
const driveTypes = ['front', 'rear', 'all', 'full'];
const currencies = ['USD', 'EUR', 'UAH', 'GBP', 'PLN'];

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
  width: '66%',
  '.MuiInputBase-input': { py: 1, px: 1.5, fontSize: 15 },
  mr: 1,
};

const sectionSx = {
  mb: 4,
  borderRadius: 2,
  p: 3,
  background: 'transparent',
};

const vinSectionSx = {
  mb: 4,
  p: 3,
  backgroundColor: 'white',
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

const EditListingPage = () => {
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();

  const { data: vehicle, isLoading, error } = useGetVehicleQuery(vehicleId!, { skip: !vehicleId });
  const [updateVehicle] = useUpdateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();

  const [images, setImages] = useState<(File | null)[]>(Array(MAX_IMAGES).fill(null));
  const [previews, setPreviews] = useState<(string | null)[]>(Array(MAX_IMAGES).fill(null));
  const [isOwner, setIsOwner] = useState(false);
  const [agree, setAgree] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(carListingSchema),
    defaultValues: {
      brand: '',
      model: '',
      price: 0,
      currency: 'USD',
      year: 0,
      location: '',
      description: '',
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

  useEffect(() => {
    if (vehicle) {
      reset({
        brand: vehicle.brand,
        model: vehicle.model,
        price: vehicle.price,
        currency: vehicle.currency,
        year: vehicle.year,
        location: vehicle.location || '',
        description: vehicle.description || '',
        mileage: vehicle.mileage || 0,
        fuel_type: vehicle.fuel_type,
        transmission: vehicle.transmission,
        body_type: vehicle.body_type,
        drive_type: vehicle.drive_type,
        is_new: vehicle.is_new ? 'true' : 'false',
        plate_number: vehicle.plate_number || '',
        color: vehicle.color,
        engine_volume: vehicle.engine_volume || 0,
        engine_power: vehicle.engine_power || 0,
        vin_code: vehicle.vin_code || '',
      });

      if (vehicle.images && vehicle.images.length > 0) {
        setPreviews(vehicle.images.map((img) => img.image));
      }
    }
  }, [vehicle, reset]);

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

  const onSubmit = async (data: any) => {
    try {
      if (!vehicleId) return;

      const updatedVehicle = {
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
        engine_volume: data.engine_volume ? parseFloat(data.engine_volume) : undefined,
        engine_power: data.engine_power ? parseInt(data.engine_power) : undefined,
        vin_code: data.vin_code || undefined,
      };

      console.log('Оновлюємо дані:', updatedVehicle);
      const result = await updateVehicle({ id: vehicleId, data: updatedVehicle }).unwrap();
      console.log('Оголошення оновлено:', result);

      // Завантаження нових зображень
      const imageUploadPromises = images
        .filter((image): image is File => image !== null)
        .map((image) => {
          return addVehicleImage({ vehicleId: vehicleId, image }).unwrap();
        });

      try {
        await Promise.all(imageUploadPromises);
        console.log('Всі зображення успішно завантажено');
      } catch (imageError) {
        console.error('Помилка при завантаженні зображень:', imageError);
      }

      navigate(routes.MY_LISTINGS);
    } catch (error: any) {
      console.error('Помилка при оновленні оголошення:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Завантаження оголошення...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Помилка: {error.toString()}
        </Typography>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Оголошення не знайдено</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 3, overflowX: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
          component="form"
          id="edit-listing-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Breadcrumbs */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Turbosell {'>'} Редагування оголошення
          </Typography>

          {/* Заголовок */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Редагування оголошення
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
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Модель"
                      placeholder="Оберіть"
                      error={!!errors.model}
                      helperText={errors.model?.message}
                      sx={inputSx}
                      InputLabelProps={{ sx: labelSx }}
                    />
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
                        <MenuItem value="Київська">Київська</MenuItem>
                        <MenuItem value="Львівська">Львівська</MenuItem>
                        <MenuItem value="Одеська">Одеська</MenuItem>
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
              >
                Зберегти зміни
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditListingPage;
