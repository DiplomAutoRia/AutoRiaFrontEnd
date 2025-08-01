import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../routes';
import { updateVehicle, fetchVehicleById, addVehicleImage } from '../../redux/vehicles/vehiclesSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carListingSchema } from '../../common/utils/zod-validation';

const brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda'];
const fuels = ['petrol', 'diesel', 'gas', 'electric'];
const transmissions = ['automatic', 'manual'];
const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan'];
const driveTypes = ['FWD', 'RWD', 'AWD', '4WD'];

const EditListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();
  const currentVehicle = useSelector((state: RootState) => state.vehicles.currentVehicle);
  const status = useSelector((state: RootState) => state.vehicles.status);
  const error = useSelector((state: RootState) => state.vehicles.error);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      mileage: 0,
      fuel_type: '',
      transmission: '',
    body_type: 'Sedan' as 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Minivan',
    drive_type: 'FWD' as 'FWD' | 'RWD' | 'AWD' | '4WD',
      location: '',
      description: '',
    },
  });

  useEffect(() => {
    if (vehicleId) {
      dispatch(fetchVehicleById(vehicleId));
    }
  }, [vehicleId, dispatch]);

  useEffect(() => {
    if (currentVehicle) {
      reset({
        brand: currentVehicle.brand,
        model: currentVehicle.model || '',
        price: currentVehicle.price,
        currency: currentVehicle.currency || 'USD',
        year: currentVehicle.year,
        mileage: currentVehicle.mileage,
        fuel_type: currentVehicle.fuel_type || currentVehicle.fuel || '',
        transmission: currentVehicle.transmission,
        body_type: currentVehicle.body_type || '',
        drive_type: currentVehicle.drive_type || '',
        location: currentVehicle.location,
        description: currentVehicle.description || '',
      });
      setPreviewImage(currentVehicle.image || null);
    }
  }, [currentVehicle, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setPreviewImage(null);
      setImageFile(null);
    }
  };

  const onSubmit = (data: any) => {
    if (!vehicleId) return;
    
    const updatedVehicle = {
      id: vehicleId,
      brand: data.brand,
      model: data.model,
      price: data.price,
      currency: data.currency,
      year: data.year,
      mileage: data.mileage,
      fuel_type: data.fuel_type,
      transmission: data.transmission,
      body_type: data.body_type,
      drive_type: data.drive_type,
      location: data.location,
      description: data.description,
    };
    
    dispatch(updateVehicle({ id: vehicleId, data: updatedVehicle }))
      .unwrap()
      .then((vehicle) => {
        console.log('Оголошення оновлено:', vehicle);

        if (imageFile && vehicle.id) {
          dispatch(addVehicleImage({ id: vehicle.id, image: imageFile }))
            .then(() => console.log('Image uploaded successfully'))
            .catch((error: any) => console.error('Error uploading image:', error));
        }
        
        navigate(routes.MY_LISTINGS);
      })
      .catch((error: any) => {
        console.error('Помилка при оновленні оголошення:', error);
      });
  };

  if (status === 'loading') {
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
          Помилка: {error}
        </Typography>
      </Container>
    );
  }

  if (!currentVehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Оголошення не знайдено</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h2" gutterBottom align="center">
            Редагувати оголошення
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.brand}>
                      <InputLabel>Марка</InputLabel>
                      <Select {...field} label="Марка">
                        {brands.map((b) => (
                          <MenuItem key={b} value={b}>
                            {b}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.brand && (
                        <Typography variant="caption" color="error">
                          {errors.brand.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Модель"
                      placeholder="Наприклад: X5"
                      error={!!errors.model}
                      helperText={errors.model?.message as string}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Ціна ($)"
                      type="number"
                      error={!!errors.price}
                      helperText={errors.price?.message as string}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Рік випуску"
                      type="number"
                      error={!!errors.year}
                      helperText={errors.year?.message as string}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="mileage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Пробіг (км)"
                      type="number"
                      error={!!errors.mileage}
                      helperText={errors.mileage?.message as string}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Валюта</InputLabel>
                      <Select {...field} label="Валюта">
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="UAH">UAH</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Опис"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message as string}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="fuel_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.fuel_type}>
                      <InputLabel>Паливо</InputLabel>
                      <Select {...field} label="Паливо">
                        <MenuItem value="petrol">Бензин</MenuItem>
                        <MenuItem value="diesel">Дизель</MenuItem>
                        <MenuItem value="gas">Газ</MenuItem>
                        <MenuItem value="electric">Електро</MenuItem>
                      </Select>
                      {errors.fuel_type && (
                        <Typography variant="caption" color="error">
                          {errors.fuel_type.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="transmission"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.transmission}>
                      <InputLabel>Коробка передач</InputLabel>
                      <Select {...field} label="Коробка передач">
                        <MenuItem value="automatic">Автомат</MenuItem>
                        <MenuItem value="manual">Механіка</MenuItem>
                      </Select>
                      {errors.transmission && (
                        <Typography variant="caption" color="error">
                          {errors.transmission.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="body_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Тип кузова</InputLabel>
                      <Select {...field} label="Тип кузова">
                        <MenuItem value="Sedan">Седан</MenuItem>
                        <MenuItem value="SUV">SUV</MenuItem>
                        <MenuItem value="Hatchback">Хетчбек</MenuItem>
                        <MenuItem value="Coupe">Купе</MenuItem>
                        <MenuItem value="Convertible">Кабріолет</MenuItem>
                        <MenuItem value="Minivan">Мінівен</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="drive_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Тип приводу</InputLabel>
                      <Select {...field} label="Тип приводу">
                        <MenuItem value="FWD">Передній</MenuItem>
                        <MenuItem value="RWD">Задній</MenuItem>
                        <MenuItem value="AWD">Повний</MenuItem>
                        <MenuItem value="4WD">4WD</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Місцезнаходження"
                      error={!!errors.location}
                      helperText={errors.location?.message as string}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      sx={{ mb: 1 }}
                    >
                      Змінити фото
                    </Button>
                  </label>
                  {imageFile?.name && (
                    <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>
                      {imageFile.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              {previewImage && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Попередній перегляд:</Typography>
                    <img
                      src={previewImage}
                      alt="Попередній перегляд"
                      style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>

            <Stack direction="row" justifyContent="center" mt={4} spacing={2}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate(routes.MY_LISTINGS)}
              >
                Скасувати
              </Button>
              <Button type="submit" variant="contained" size="large">
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
