import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addVehicle } from '../../redux/vehicles/vehiclesSlice';
import { v4 as uuidv4 } from 'uuid';
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
const fuels = ['Бензин', 'Дизель', 'Газ', 'Електро'];
const transmissions = ['Автомат', 'Механіка'];

const CreateListingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carListingSchema),
    defaultValues: {
      title: '',
      price: 0,
      year: 0,
      mileage: 0,
      brand: '',
      fuel: '',
      transmission: '',
      location: '',
      image: undefined,
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
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = (data: any) => {
    const newVehicle = {
      id: uuidv4(),
      title: data.title,
      price: data.price,
      year: data.year,
      mileage: data.mileage,
      brand: data.brand,
      fuel: data.fuel,
      transmission: data.transmission,
      location: data.location,
      image: previewImage || '',
    };
    
    dispatch(addVehicle(newVehicle));
    console.log('Оголошення створено:', newVehicle);
    navigate('/');
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
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Назва"
                      placeholder="Наприклад: BMW X5 2020"
                      error={!!errors.title}
                      helperText={errors.title?.message as string}
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
                <FormControl fullWidth error={!!errors.brand}>
                  <InputLabel>Марка</InputLabel>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Марка">
                        {brands.map((b) => (
                          <MenuItem key={b} value={b}>
                            {b}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.brand && (
                    <Typography variant="caption" color="error">
                      {errors.brand.message as string}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.fuel}>
                  <InputLabel>Паливо</InputLabel>
                  <Controller
                    name="fuel"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Паливо">
                        {fuels.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.fuel && (
                    <Typography variant="caption" color="error">
                      {errors.fuel.message as string}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.transmission}>
                  <InputLabel>Коробка передач</InputLabel>
                  <Controller
                    name="transmission"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Коробка передач">
                        {transmissions.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.transmission && (
                    <Typography variant="caption" color="error">
                      {errors.transmission.message as string}
                    </Typography>
                  )}
                </FormControl>
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
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleImageChange(e);
                        }}
                        ref={field.ref}
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
                      {field.value?.[0]?.name && (
                        <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>
                          {field.value[0].name}
                        </Typography>
                      )}
                      {errors.image && (
                        <Typography variant="caption" color="error" display="block">
                          {errors.image.message as string}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
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
