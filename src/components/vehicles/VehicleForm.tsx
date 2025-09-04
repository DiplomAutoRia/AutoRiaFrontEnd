import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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

const getVehicleSchema = (t: any) =>
  z.object({
    vehicle_type: z.enum(VEHICLE_TYPES, { required_error: t('vehicles.validation.vehicleTypeRequired') }),
    brand: z.string().min(1, t('vehicles.validation.makeRequired')),
    model: z.string().min(1, t('vehicles.validation.modelRequired')),
    year: z
      .number()
      .min(1900, t('vehicles.validation.yearMin'))
      .max(new Date().getFullYear() + 1, t('vehicles.validation.yearInvalid')),
    price: z.number().min(0, t('vehicles.validation.priceNegative')),
    currency: z.enum(CURRENCY_TYPES, { required_error: t('vehicles.validation.currencyRequired') }),
    description: z.string().min(10, t('vehicles.validation.descriptionMin')),
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

type VehicleFormData = z.infer<ReturnType<typeof getVehicleSchema>>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (_data: VehicleCreateRequest & { uploaded_images?: File[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [t('vehicles.form.basicInfo'), t('vehicles.form.specifications'), t('vehicles.form.additionalInfo')];
  const vehicleSchema = getVehicleSchema(t);
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
                    <InputLabel>{t('vehicles.vehicleType')} *</InputLabel>
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
                    <InputLabel>{t('vehicles.make')} *</InputLabel>
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
                    label={`${t('vehicles.model')} *`}
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
                    label={`${t('vehicles.yearOfManufacture')} *`}
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
                    label={`${t('vehicles.price')} *`}
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
                    <InputLabel>{t('vehicles.currency')} *</InputLabel>
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
                    label={`${t('vehicles.description')} *`}
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
                render={({ field }) => <TextField {...field} label={t('vehicles.location')} fullWidth />}
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
                    label={t('vehicles.mileageKm')}
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
                    <InputLabel>{t('vehicles.color')}</InputLabel>
                    <Select {...field}>
                      <MenuItem value="">{t('common.notSpecified')}</MenuItem>
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
                    label={t('vehicles.engineVolumeL')}
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
                    label={t('vehicles.enginePower')}
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
                    <InputLabel>{t('vehicles.fuelType')}</InputLabel>
                    <Select {...field}>
                      <MenuItem value="">{t('common.notSpecified')}</MenuItem>
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
                    <InputLabel>{t('vehicles.transmission')}</InputLabel>
                    <Select {...field}>
                      <MenuItem value="">{t('common.notSpecified')}</MenuItem>
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
                render={({ field }) => <TextField {...field} label={t('vehicles.registrationCountry')} fullWidth />}
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
                    label={t('vehicles.ownersCount')}
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
                  <TextField
                    {...field}
                    label={t('vehicles.vinCode')}
                    fullWidth
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="is_custom_cleared"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={t('vehicles.customCleared')}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t('vehicles.photos')}
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
                  {t('vehicles.addPhoto')}
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
          {vehicle ? t('vehicles.editListing') : t('vehicles.createListing')}
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
              {activeStep === 0 ? t('common.cancel') : t('common.back')}
            </Button>

            <Box>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext} disabled={isLoading}>
                  {t('common.next')}
                </Button>
              ) : (
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {vehicle ? t('common.update') : t('common.create')}
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
