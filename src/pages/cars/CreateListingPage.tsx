import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { useCreateVehicleMutation, useAddVehicleImageMutation } from '../../redux/api/vehiclesApi';
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
import { carListingSchema } from '../../common/utils/zod-validation';
import { zodResolver } from '@hookform/resolvers/zod';

const brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda'];
const fuels = ['petrol', 'diesel', 'gas', 'electric'];
const transmissions = ['automatic', 'manual'];
const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan'];
const driveTypes = ['FWD', 'RWD', 'AWD', '4WD'];

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm({
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
      fuel_type: '',
      transmission: '',
    body_type: 'Sedan' as 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Minivan',
    drive_type: 'FWD' as 'FWD' | 'RWD' | 'AWD' | '4WD',
    },
  });

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

  const onSubmit = async (data: any) => {
    try {
      const newVehicle = {
        vehicle_type: 'car' as const,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        currency: data.currency,
        description: data.description,
        location: data.location,
        mileage: data.mileage,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        body_type: data.body_type,
        drive_type: data.drive_type,
      };
      
      const vehicle = await createVehicle(newVehicle).unwrap();
      console.log('Оголошення створено:', vehicle);

      if (imageFile && vehicle.id) {
        try {
          await addVehicleImage({ vehicleId: vehicle.id, image: imageFile }).unwrap();
          console.log('Image uploaded successfully');
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
        }
      }
      
      navigate(routes.HOME);
    } catch (error: any) {
      console.error('Помилка при створенні оголошення:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h2" gutterBottom align="center">
            Створити оголошення
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
                          {errors.brand.message}
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
                        helperText={errors.model?.message}
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
                        helperText={errors.price?.message}
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
                        helperText={errors.year?.message}
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
                        helperText={errors.mileage?.message}
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
                        {fuels.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.fuel_type && (
                        <Typography variant="caption" color="error">
                          {errors.fuel_type.message}
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
              
              <Grid item xs={6}>
                <Controller
                  name="body_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Тип кузова</InputLabel>
                      <Select {...field} label="Тип кузова">
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
              
              <Grid item xs={6}>
                <Controller
                  name="drive_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Тип приводу</InputLabel>
                      <Select {...field} label="Тип приводу">
                        {driveTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
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
                        helperText={errors.location?.message}
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
                      Вибрати фото
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

            <Stack direction="row" justifyContent="center" mt={4}>
              <Button type="submit" variant="contained" size="large">
                Створити оголошення
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateListingPage;
