import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { z } from 'zod';

import { POPULAR_BRANDS } from '../../models/brands';
import { COLOR_TYPES, CURRENCY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_TYPES } from '../../models/vehicle';
import type { Vehicle, VehicleCreateRequest, VehicleType } from '../../models/vehicle';

const vehicleSchema = z.object({
  vehicle_type: z.enum(VEHICLE_TYPES, { required_error: 'Виберіть тип транспорту' }),
  brand: z.string().min(1, "Марка обов'язкова"),
  model: z.string().min(1, "Модель обов'язкова"),
  year: z
    .number()
    .min(1900, 'Рік не може бути менше 1900')
    .max(new Date().getFullYear() + 1, 'Недійсний рік'),
  price: z.number().min(0, "Ціна не може бути від'ємною"),
  currency: z.enum(CURRENCY_TYPES, { required_error: "Валюта обов'язкова" }),
  description: z.string().min(10, 'Опис повинен містити принаймні 10 символів'),
  location: z.string().optional(),
  mileage: z.number().optional(),
  color: z.union([z.enum(COLOR_TYPES), z.literal('')]).optional(),
  engine_volume: z.number().optional(),
  engine_power: z.number().optional(),
  fuel_type: z.union([z.enum(FUEL_TYPES), z.literal('')]).optional(),
  transmission: z.union([z.enum(TRANSMISSION_TYPES), z.literal('')]).optional(),
  registration_country: z.string().optional(),
  is_custom_cleared: z.boolean().optional(),
  vin_code: z.string().optional(),
  number_of_owners: z.number().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (_data: VehicleCreateRequest & { uploaded_images?: File[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const steps = ['Основна інформація', 'Технічні характеристики', 'Додаткова інформація'];

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel, isLoading = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [formKey] = useState(Date.now());

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    mode: 'onChange',
    defaultValues: vehicle
      ? {
          vehicle_type: vehicle.vehicle_type,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          currency: vehicle.currency,
          description: vehicle.description,
          location: vehicle.location || '',
          mileage: vehicle.mileage || undefined,
          color: vehicle.color || '',
          engine_volume: vehicle.engine_volume || undefined,
          engine_power: vehicle.engine_power || undefined,
          fuel_type: vehicle.fuel_type || '',
          transmission: vehicle.transmission || '',
          registration_country: vehicle.registration_country || '',
          is_custom_cleared: vehicle.is_custom_cleared || false,
          vin_code: vehicle.vin_code || '',
          number_of_owners: vehicle.number_of_owners || undefined,
        }
      : {
          vehicle_type: 'car' as VehicleType,
          currency: 'USD',
          is_custom_cleared: false,
          brand: '',
          model: '',
          year: '' as any,
          price: '' as any,
          description: '',
          location: '',
          mileage: '' as any,
          color: '',
          engine_volume: '' as any,
          engine_power: '' as any,
          fuel_type: '',
          transmission: '',
          registration_country: '',
          vin_code: '',
          number_of_owners: '' as any,
        },
  });

  useEffect(() => {
    if (!vehicle) {
      reset({
        vehicle_type: 'car' as VehicleType,
        currency: 'USD',
        is_custom_cleared: false,
        brand: '',
        model: '',
        year: '' as any,
        price: '' as any,
        description: '',
        location: '',
        mileage: '' as any,
        color: '',
        engine_volume: '' as any,
        engine_power: '' as any,
        fuel_type: '',
        transmission: '',
        registration_country: '',
        vin_code: '',
        number_of_owners: '' as any,
      });
    }
  }, [formKey, reset, vehicle]);

  useEffect(() => {
    if (vehicle?.images) {
      setImagePreview(vehicle.images.map((img) => img.image));
    }
  }, [vehicle]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedImages((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    if (index < uploadedImages.length) {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onFormSubmit = (data: VehicleFormData) => {
    const transformedData = {
      ...data,
      year: data.year || new Date().getFullYear(),
      price: data.price || 0,
      color: data.color || undefined,
      fuel_type: data.fuel_type || undefined,
      transmission: data.transmission || undefined,
      mileage: data.mileage || undefined,
      engine_volume: data.engine_volume || undefined,
      engine_power: data.engine_power || undefined,
      number_of_owners: data.number_of_owners || undefined,
      uploaded_images: uploadedImages,
    };
    onSubmit(transformedData);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="vehicle_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicle_type}>
                    <InputLabel>Тип транспорту *</InputLabel>
                    <Select {...field}>
                      {VEHICLE_TYPES.map((type) => (
                        <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.brand}>
                    <InputLabel>Марка *</InputLabel>
                    <Select {...field}>
                      {POPULAR_BRANDS.map((brandName) => (
                        <MenuItem key={brandName} value={brandName}>
                          {brandName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Модель *"
                    fullWidth
                    error={!!errors.model}
                    helperText={errors.model?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                key="year-field"
                name="year"
                control={control}
                render={({ field }) => (
                  <TextField
                    name="vehicle-year"
                    value={field.value || ''}
                    label="Рік випуску *"
                    type="number"
                    fullWidth
                    error={!!errors.year}
                    helperText={errors.year?.message}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? '' : parseInt(val) || '');
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value || ''}
                    label="Ціна *"
                    type="number"
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? '' : parseFloat(val) || '');
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Валюта *</InputLabel>
                    <Select {...field}>
                      {CURRENCY_TYPES.map((currency) => (
                        <MenuItem key={currency} value={currency}>
                          {currency}
                        </MenuItem>
                      ))}
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
                    label="Опис *"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => <TextField {...field} label="Місцезнаходження" fullWidth />}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="mileage"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value || ''}
                    label="Пробіг (км)"
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? '' : parseInt(val) || '');
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Колір</InputLabel>
                    <Select {...field}>
                      <MenuItem value="">Не вказано</MenuItem>
                      {COLOR_TYPES.map((color) => (
                        <MenuItem key={color} value={color} sx={{ textTransform: 'capitalize' }}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="engine_volume"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value || ''}
                    label="Об'єм двигуна (л)"
                    type="number"
                    inputProps={{ step: '0.1' }}
                    fullWidth
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? '' : parseFloat(val) || '');
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                key="engine-power-field"
                name="engine_power"
                control={control}
                render={({ field }) => (
                  <TextField
                    name="vehicle-engine-power"
                    value={field.value || ''}
                    label="Потужність двигуна (к.с.)"
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? '' : parseInt(val) || '');
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fuel_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Тип палива</InputLabel>
                    <Select {...field}>
                      <MenuItem value="">Не вказано</MenuItem>
                      {FUEL_TYPES.map((fuel) => (
                        <MenuItem key={fuel} value={fuel} sx={{ textTransform: 'capitalize' }}>
                          {fuel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="transmission"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Коробка передач</InputLabel>
                    <Select {...field}>
                      <MenuItem value="">Не вказано</MenuItem>
                      {TRANSMISSION_TYPES.map((transmission) => (
                        <MenuItem key={transmission} value={transmission} sx={{ textTransform: 'capitalize' }}>
                          {transmission}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="registration_country"
                control={control}
                render={({ field }) => <TextField {...field} label="Країна реєстрації" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="number_of_owners"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value || ''}
                    label="Кількість власників"
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? '' : parseInt(val) || '');
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="vin_code"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="VIN код" fullWidth inputProps={{ style: { fontFamily: 'monospace' } }} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="is_custom_cleared"
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Розмитнений" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Фотографії
              </Typography>

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" startIcon={<Add />} sx={{ mb: 2 }}>
                  Додати фото
                </Button>
              </label>

              {imagePreview.length > 0 && (
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {imagePreview.map((src, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          minWidth: 'auto',
                          p: 0.5,
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Delete fontSize="small" />
                      </Button>
                    </Box>
                  ))}
                </Stack>
              )}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {vehicle ? 'Редагувати оголошення' : 'Створити оголошення'}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form key={formKey} onSubmit={handleSubmit(onFormSubmit)}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={activeStep === 0 ? onCancel : handleBack} disabled={isLoading}>
              {activeStep === 0 ? 'Скасувати' : 'Назад'}
            </Button>

            <Box>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext} disabled={isLoading}>
                  Далі
                </Button>
              ) : (
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {vehicle ? 'Оновити' : 'Створити'}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
