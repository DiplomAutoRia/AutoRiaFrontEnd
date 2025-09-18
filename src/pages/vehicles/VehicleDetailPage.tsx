import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getUserById } from '../../redux/auth/authSlice';
import { fetchVehiclesByUserId, selectOwnerVehicles } from '../../redux/vehicles/vehiclesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  ArrowBack,
  Email,
  Favorite,
  FavoriteBorder,
  Share,
  Star as StarIcon,
  Visibility,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import { MessageModal } from '../../components/messages';
import {
  useAddToFavoritesMutation,
  useGetFavoritesQuery,
  useRemoveFromFavoritesMutation,
} from '../../redux/api/favoritesApi';
import { useGetVehicleQuery } from '../../redux/api/vehiclesApi';
import type { RootState } from '../../redux/store';

const VerifiedInfoBlock: React.FC<{ vehicle: any }> = ({ vehicle }) => (
  <Paper sx={{ p: 3, mb: 3, mt: 1 }}>
    {/* --- Перевірено Turbosell за реєстрами МВС --- */}
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Перевірено Turbosell за реєстрами МВС
        </Typography>
        <Tooltip title="Інформація з державних реєстрів">
          <InfoOutlinedIcon sx={{ fontSize: 18, color: '#bdbdbd' }} />
        </Tooltip>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Оновлено 10 липня 2025
      </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <DirectionsCarIcon sx={{ color: '#156ff5' }} />
          {vehicle.vin_code && (
            <Box
              sx={{
                bgcolor: '#eaf2ff',
                color: '#156ff5',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: 15,
                mr: 1,
              }}
            >
              {vehicle.vin_code}
            </Box>
          )}
          {vehicle.plate_number && (
            <Box
              sx={{
                bgcolor: '#156ff5',
                color: '#fff',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box component="span" sx={{ mr: 0.5 }}>
                UA
              </Box>
              {vehicle.plate_number}
            </Box>
          )}
        </Stack>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>Марка, модель, рік</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>{vehicle.brand} {vehicle.model} {vehicle.year}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>Двигун</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>
              {vehicle.engine_volume ? `${vehicle.engine_volume} л` : ''}
              {vehicle.engine_power ? ` • ${vehicle.engine_power} к.с.` : ''}
              {vehicle.fuel_type ? ` • ${vehicle.fuel_type}` : ''}
              {!vehicle.engine_volume && !vehicle.engine_power && !vehicle.fuel_type && 'Не вказано'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>Колір</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>{vehicle.color || 'Не вказано'}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>Перша операція</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>
              27.06.2020 • 5 років тому
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
            реєстрація ТЗ привезеного з-за кордону по посвідченню митниці
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>Остання операція</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>
              20.07.2024 • 11 міс. тому
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
            перереєстрація на нового власника за дог. купівлі-продажу (СГ)
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>Кількість власників</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>7</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography>В розшуку</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>Ні</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>

    {/* --- Перевірено Turbosell за реєстрами рухомого майна --- */}
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Перевірено Turbosell за реєстрами рухомого майна
        </Typography>
        <Tooltip title="Інформація з реєстрів обтяжень">
          <InfoOutlinedIcon sx={{ fontSize: 18, color: '#bdbdbd' }} />
        </Tooltip>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Оновлено 17 липня 2025
      </Typography>
    </Box>

    {/* --- Перевірено Turbosell по страховим базам України --- */}
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Перевірено Turbosell по страховим базам України
        </Typography>
        <Tooltip title="Інформація зі страхових реєстрів">
          <InfoOutlinedIcon sx={{ fontSize: 18, color: '#bdbdbd' }} />
        </Tooltip>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Оновлено 17 липня 2025
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Наявність страхового випадку</Typography>
            <Typography sx={{ ml: 'auto', fontWeight: 500 }}>не виявлено</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

type OwnerPhone = {
  number: string;
  name: string;
};

const VehicleInfoBlock: React.FC<{ vehicle: any; owner: any; onContactSeller: () => void }> = ({ vehicle, owner, onContactSeller }) => (
  <Box sx={{ mb: 3, px: 0, py: 0 }}>
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
      {vehicle.brand} {vehicle.model} {vehicle.year}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {vehicle.generation} {vehicle.modification}
    </Typography>
    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      {vehicle.installment && (
        <Chip label="Можлива оплата частинами" color="primary" size="small" />
      )}
      {vehicle.bargain && (
        <Chip label="Торг" color="primary" size="small" />
      )}
    </Stack>
    <Stack direction="row" spacing={2} sx={{ mb: 1, flexWrap: 'wrap' }}>
      <Typography variant="body2">
        {vehicle.body_type} | {vehicle.doors} дверей | {vehicle.seats} місць
      </Typography>
    </Stack>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {vehicle.mileage && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Пробіг</Typography>
            <Typography>{vehicle.mileage} тис. км</Typography>
          </Grid>
        )}
        {(vehicle.engine_volume || vehicle.engine_power || vehicle.fuel_type) && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Двигун</Typography>
            <Typography>
              {vehicle.engine_volume && `${vehicle.engine_volume} л`}
              {vehicle.engine_power && ` (${vehicle.engine_power} к.с.)`}
              {vehicle.fuel_type && ` • ${vehicle.fuel_type}`}
            </Typography>
          </Grid>
        )}
        {vehicle.transmission && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Коробка передач</Typography>
            <Typography>{vehicle.transmission}</Typography>
          </Grid>
        )}
        {vehicle.drive_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Привід</Typography>
            <Typography>{vehicle.drive_type}</Typography>
          </Grid>
        )}
        {vehicle.color && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Колір</Typography>
            <Typography>{vehicle.color}</Typography>
          </Grid>
        )}
        {vehicle.registration_country && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Країна реєстрації</Typography>
            <Typography>{vehicle.registration_country}</Typography>
          </Grid>
        )}
        {vehicle.is_custom_cleared !== undefined && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Розмитнено</Typography>
            <Typography>{vehicle.is_custom_cleared ? 'Так' : 'Ні'}</Typography>
          </Grid>
        )}
        {vehicle.vin_code && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">VIN код</Typography>
            <Typography>{vehicle.vin_code}</Typography>
          </Grid>
        )}
        {vehicle.number_of_owners && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Кількість власників</Typography>
            <Typography>{vehicle.number_of_owners}</Typography>
          </Grid>
        )}
        <Grid item xs={6} sm={4}>
          <Typography variant="body2" color="text.secondary">Стан</Typography>
          <Typography>{vehicle.is_new ? 'Новий' : 'Вживаний'}</Typography>
        </Grid>
        {vehicle.plate_number && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Держ. номер</Typography>
            <Typography>{vehicle.plate_number}</Typography>
          </Grid>
        )}
        {vehicle.body_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип кузова</Typography>
            <Typography>{vehicle.body_type}</Typography>
          </Grid>
        )}
        {vehicle.technical_condition && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Технічний стан</Typography>
            <Typography>{vehicle.technical_condition}</Typography>
          </Grid>
        )}
        {vehicle.seats && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Кількість місць</Typography>
            <Typography>{vehicle.seats}</Typography>
          </Grid>
        )}
        {vehicle.doors_count && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Кількість дверей</Typography>
            <Typography>{vehicle.doors_count}</Typography>
          </Grid>
        )}
        {vehicle.weight && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Вага</Typography>
            <Typography>{vehicle.weight} кг</Typography>
          </Grid>
        )}
        {vehicle.vehicle_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип транспорту</Typography>
            <Typography>{vehicle.vehicle_type}</Typography>
          </Grid>
        )}
        {vehicle.specialization && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Спеціалізація</Typography>
            <Typography>{vehicle.specialization}</Typography>
          </Grid>
        )}
        {vehicle.truck_load_capacity && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Вантажопідйомність</Typography>
            <Typography>{vehicle.truck_load_capacity} т</Typography>
          </Grid>
        )}
        {vehicle.axle_count && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Кількість осей</Typography>
            <Typography>{vehicle.axle_count}</Typography>
          </Grid>
        )}
        {vehicle.trailer_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип причепа</Typography>
            <Typography>{vehicle.trailer_type}</Typography>
          </Grid>
        )}
        {vehicle.trailer_load_capacity && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Вантажопідйомність причепа</Typography>
            <Typography>{vehicle.trailer_load_capacity} т</Typography>
          </Grid>
        )}
        {vehicle.bike_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип мотоцикла</Typography>
            <Typography>{vehicle.bike_type}</Typography>
          </Grid>
        )}
        {vehicle.seat_height && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Висота сидіння</Typography>
            <Typography>{vehicle.seat_height} см</Typography>
          </Grid>
        )}
        {vehicle.boat_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип човна</Typography>
            <Typography>{vehicle.boat_type}</Typography>
          </Grid>
        )}
        {vehicle.engine_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип двигуна</Typography>
            <Typography>{vehicle.engine_type}</Typography>
          </Grid>
        )}
        {vehicle.hull_material && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Матеріал корпусу</Typography>
            <Typography>{vehicle.hull_material}</Typography>
          </Grid>
        )}
        {vehicle.aircraft_type && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Тип літака</Typography>
            <Typography>{vehicle.aircraft_type}</Typography>
          </Grid>
        )}
        {vehicle.engine_count && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Кількість двигунів</Typography>
            <Typography>{vehicle.engine_count}</Typography>
          </Grid>
        )}
        {vehicle.max_altitude && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Макс. висота</Typography>
            <Typography>{vehicle.max_altitude} м</Typography>
          </Grid>
        )}
        {vehicle.sleeping_places && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Спальні місця</Typography>
            <Typography>{vehicle.sleeping_places}</Typography>
          </Grid>
        )}
        {vehicle.has_kitchen !== undefined && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Кухня</Typography>
            <Typography>{vehicle.has_kitchen ? 'Так' : 'Ні'}</Typography>
          </Grid>
        )}
        {vehicle.has_bathroom !== undefined && (
          <Grid item xs={6} sm={4}>
            <Typography variant="body2" color="text.secondary">Ванна кімната</Typography>
            <Typography>{vehicle.has_bathroom ? 'Так' : 'Ні'}</Typography>
          </Grid>
        )}
      </Grid>
    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      Опис
    </Typography>
    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
      {vehicle.description}
    </Typography>
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Лакофарбове покриття</Typography>
        <Typography>{vehicle.paint_condition || 'Як нове'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Технічний стан</Typography>
        <Typography>{vehicle.technical_condition || 'Повністю непошкоджене'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Матеріали салону</Typography>
        <Typography>{vehicle.interior_material || 'Велюр'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Регулювання сидінь салону</Typography>
        <Typography>{vehicle.seat_adjustment || 'Ручне регулювання передніх сидінь'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Електросклопідйомники</Typography>
        <Typography>{vehicle.windows || 'Передні та задні'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Кондиціонер</Typography>
        <Typography>{vehicle.air_conditioner || 'Кондиціонер'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Підсилювач керма</Typography>
        <Typography>{vehicle.steering_booster || 'Гідро'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Регулювання керма</Typography>
        <Typography>{vehicle.steering_adjustment || 'По висоті та по вильоту'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Запасне колесо</Typography>
        <Typography>{vehicle.spare_wheel || 'Повнорозмірне'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Мультимедіа</Typography>
        <Typography>{vehicle.multimedia || 'AUX • Bluetooth'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="body2" color="text.secondary">Система допомоги при паркуванні</Typography>
        <Typography>{vehicle.parking_assist || 'Задня камера'}</Typography>
      </Grid>
    </Grid>
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Звʼязатися з продавцем: <Box component="span" sx={{ color: '#156ff5', fontWeight: 500 }}>{owner?.name || 'Продавець'}</Box>
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {owner?.phones?.map((phone: OwnerPhone, idx: number) => (
          <React.Fragment key={idx}>
            <Button variant="outlined" size="small" sx={{ fontWeight: 700, color: '#43a047', borderColor: '#43a047' }}>
              {phone.number}
            </Button>
          </React.Fragment>
        ))}
        <Button variant="outlined" size="small" sx={{ fontWeight: 700 }} onClick={onContactSeller}>
          Написати
        </Button>
      </Stack>
    </Box>
  </Box>
);

interface SellerOtherListingsProps {
  listings: any[];
  currentVehicleId?: number;
}

const SellerOtherListings: React.FC<SellerOtherListingsProps> = ({ listings = [], currentVehicleId }) => {
  const navigate = useNavigate();
  
  // Фільтруємо оголошення, щоб не показувати поточне оголошення
  const filteredListings = listings.filter((item: any) => item.id !== currentVehicleId).slice(0, 5);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
    }).format(price);
  };

  const handleListingClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Інші оголошення продавця
      </Typography>
      <Stack spacing={2}>
        {filteredListings.length > 0 ? (
          filteredListings.map((item, idx) => (
            <Box 
              key={item.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                borderBottom: idx < filteredListings.length - 1 ? '1px solid #e0e0e0' : 'none', 
                pb: 1, 
                mb: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                transition: 'background-color 0.2s',
                p: 1,
                borderRadius: 1,
              }}
              onClick={() => handleListingClick(item.id)}
            >
              <Box
                component="img"
                src={item.images?.[0]?.image || '/api/placeholder/80/60'}
                alt={`${item.brand} ${item.model}`}
                sx={{
                  width: 80,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mr: 2,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{item.brand} {item.model} {item.year}</Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography sx={{ color: '#43a047', fontWeight: 700, fontSize: 18 }}>
                    {formatPrice(item.price, item.currency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.mileage ? `${item.mileage} тис. км` : ''} | {item.fuel_type || ''}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Інші оголошення продавця відсутні
          </Typography>
        )}
      </Stack>
      <Button
        variant="outlined"
        fullWidth
        sx={{
          mt: 2,
          borderColor: '#156ff5',
          color: '#156ff5',
          fontWeight: 500,
          textTransform: 'none',
        }}
      >
        Дивитись всі оголошення
      </Button>
    </Paper>
  );
};

const VehicleDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [owner, setOwner] = useState<any>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const user = useAppSelector((state: RootState) => state.auth.user);
  const { data: vehicle, isLoading, error } = useGetVehicleQuery(Number(id));
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !user });
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const ownerVehicles = useAppSelector(selectOwnerVehicles);

  const favorite = favorites.find((fav) => fav.vehicle === Number(id));
  const isFavorite = user ? !!favorite : false;

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite && favorite) {
        await removeFromFavorites(favorite.id).unwrap();
      } else {
        await addToFavorites({ vehicle: Number(id) }).unwrap();
      }
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share && vehicle) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        text: vehicle.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!vehicle) {
      return;
    }

    if (vehicle.user === user.id) {
      alert('Ви не можете написати самому собі');
      return;
    }

    setMessageModalOpen(true);
  };

  const handleCallSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Функція дзвінка буде додана пізніше');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UAH',
    }).format(price);
  };

  // Отримання інформації про власника
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (vehicle && vehicle.user) {
        setOwnerLoading(true);
        try {
          const result = await dispatch(getUserById(vehicle.user)).unwrap();
          if (result && result.user) {
            setOwner({
              name: `${result.user.first_name} ${result.user.last_name}`,
              email: result.user.email,
              dateJoined: result.user.date_joined,
              avatar: result.user.avatar,
              isVerified: result.user.is_verified,
              // Додаємо мок-дані для сумісності з існуючим кодом
              isCompany: false,
              listings: 80,
              bankVerified: true,
              phoneVerified: true,
            });
          }
        } catch (error) {
          console.error('Failed to fetch owner info:', error);
          // Використовуємо заглушкові дані у випадку помилки
          setOwner({
            name: 'Користувач',
            email: 'email@example.com',
            dateJoined: '2025-01-01',
            isCompany: false,
            listings: 80,
            bankVerified: true,
            phoneVerified: true,
          });
        } finally {
          setOwnerLoading(false);
        }
      }
    };

    fetchOwnerInfo();
  }, [vehicle, dispatch]);

  // Отримання оголошень власника
  useEffect(() => {
    if (vehicle && vehicle.user) {
      console.log('Fetching vehicles for user:', vehicle.user);
      dispatch(fetchVehiclesByUserId(vehicle.user.toString()))
        .unwrap()
        .then((result) => {
          console.log('Owner vehicles fetched:', result);
        })
        .catch((error) => {
          console.error('Failed to fetch owner vehicles:', error);
        });
    }
  }, [vehicle, dispatch]);

  // Оновлення кількості оголошень власника
  useEffect(() => {
    if (owner && ownerVehicles.length > 0) {
      setOwner((prevOwner: any) => ({
        ...prevOwner,
        listings: ownerVehicles.length
      }));
    }
  }, [ownerVehicles]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !vehicle) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Транспортний засіб не знайдено або сталася помилка завантаження</Alert>
        <Box mt={2}>
          <Button onClick={() => navigate('/')} startIcon={<ArrowBack />}>
            Повернутися до головної
          </Button>
        </Box>
      </Container>
    );
  }

  const images = vehicle.images || [];
  const mainImage = images.length > 0 ? images[selectedImage]?.image : '/api/placeholder/600/400';

  // Кількість прев'ю в рядку (як на макеті)
  const previewCount = 7;
  const showPreviewImages = !showAllPhotos && images.length > previewCount ? images.slice(0, previewCount) : images;


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          Назад
        </Button>

        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Chip
                label={vehicle.vehicle_type?.toUpperCase() || 'UNKNOWN'}
                color="primary"
                sx={{ textTransform: 'capitalize' }}
              />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Visibility fontSize="small" color="action" />
                <Typography variant="body2">{vehicle.views_count} переглядів</Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            {user && (
              <Tooltip title={isFavorite ? 'Видалити з обраного' : 'Додати до обраного'}>
                <IconButton 
                  onClick={handleFavoriteToggle} 
                  sx={{ 
                    color: isFavorite ? '#156ff5' : 'default',
                    '&:hover': {
                      color: isFavorite ? '#1158d4' : '#156ff5'
                    }
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('vehicles.share')}>
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Блок фото без бордерів і фону */}
          <Box sx={{ p: 0, mb: 2, background: 'none', boxShadow: 'none' }}>
            {images.length > 0 ? (
              <Box>
                {/* Головне фото */}
                <Box
                  component="img"
                  src={mainImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    borderRadius: 0, // кути 90 градусів
                    mb: 1.5,
                  }}
                />
                {/* Прев'ю фото в один рядок */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  {showPreviewImages.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        border: selectedImage === index ? '2px solid #156ff5' : '2px solid transparent',
                        borderRadius: 0, // кути 90 градусів
                        overflow: 'hidden',
                        cursor: 'pointer',
                        width: 80,
                        height: 60,
                        flexShrink: 0,
                        transition: 'border 0.2s',
                        boxSizing: 'border-box',
                        background: 'none',
                        position: 'relative',
                        m: 0,
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.image}
                        alt={`Фото ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          borderRadius: 0,
                        }}
                      />
                    </Box>
                  ))}
                  {/* Якщо фото більше, ніж прев'ю, показати "..." */}
                  {images.length > previewCount && !showAllPhotos && (
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'none',
                        borderRadius: 0,
                        fontWeight: 700,
                        fontSize: 22,
                        color: '#156ff5',
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        ml: 0,
                      }}
                      onClick={() => setShowAllPhotos(true)}
                    >
                      +{images.length - previewCount}
                    </Box>
                  )}
                </Box>
                {/* Посилання "Показати всі фотографії" */}
                {images.length > previewCount && !showAllPhotos && (
                  <Typography
                    sx={{
                      color: '#156ff5',
                      fontSize: 15,
                      cursor: 'pointer',
                      mt: 0.5,
                      ml: 0.5,
                      width: 'fit-content',
                    }}
                    onClick={() => setShowAllPhotos(true)}
                  >
                    Показати всі фотографії ▼
                  </Typography>
                )}
                {/* Всі фото у кілька рядків, якщо showAllPhotos */}
                {showAllPhotos && (
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={0.5}>
                      {images.map((image, index) => (
                        <Grid item xs={2} key={index}>
                          <Box
                            sx={{
                              border: selectedImage === index ? '2px solid #156ff5' : '2px solid transparent',
                              borderRadius: 0,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              width: '100%',
                              height: 60,
                              background: 'none',
                              boxSizing: 'border-box',
                              m: 0,
                            }}
                            onClick={() => setSelectedImage(index)}
                          >
                            <img
                              src={image.image}
                              alt={`Фото ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                borderRadius: 0,
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Typography
                      sx={{
                        color: '#156ff5',
                        fontSize: 15,
                        cursor: 'pointer',
                        mt: 1,
                        width: 'fit-content',
                      }}
                      onClick={() => setShowAllPhotos(false)}
                    >
                      Приховати фотографії ▲
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 0,
                }}
              >
                <Typography color="text.secondary">Фото відсутні</Typography>
              </Box>
            )}
          </Box>

          {/* Блок перевіреної інформації */}
          <VerifiedInfoBlock vehicle={vehicle} />

          {/* Блок інформації про машину */}
          <VehicleInfoBlock vehicle={vehicle} owner={owner} onContactSeller={handleContactSeller} />

          {/* Опис (можна видалити, якщо опис вже є у VehicleInfoBlock) */}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ mb: 3, boxShadow: 'none', border: 'none' }}>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {formatPrice(vehicle.price, vehicle.currency)}
                <Typography component="span" sx={{ fontSize: 18, color: '#4caf50', ml: 1 }}>
                  Договірна
                </Typography>
              </Typography>
              {vehicle.currency === 'USD' && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {formatPrice(vehicle.price * 40, 'UAH')}
                </Typography>
              )}
              {/* --- Блок власника --- */}
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid #f0f0f0',
                  borderRadius: 0,
                  p: 2,
                  mb: 2,
                  bgcolor: '#fff',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#888',
                    }}
                  >
                    {/* Аватар або ініціали */}
                    {owner?.avatar ? (
                      <img
                        src={owner.avatar}
                        alt={owner.name}
                        style={{ width: 48, height: 48, borderRadius: '50%' }}
                      />
                    ) : (
                      owner?.name?.[0] || '?'
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {owner?.name || 'Продавець'}
                      {owner?.isCompany && (
                        <Typography component="span" sx={{ color: '#bdbdbd', fontWeight: 400, ml: 1 }}>
                          | Компанія
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {owner?.dateJoined || 'Дата реєстрації не вказана'}
                    </Typography>
                  </Box>
                </Stack>
                <Stack spacing={1} sx={{ mb: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">
                      Перевірений командою <b>Turbosell</b>
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">{owner?.listings || '0'} оголошень</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">Перевірений банком</Typography>
                    <Tooltip title="Банківські реквізити перевірені">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: '#bdbdbd', ml: 0.5 }} />
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">Перевірені дані</Typography>
                    <Tooltip title="Дані підтверджені">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: '#bdbdbd', ml: 0.5 }} />
                    </Tooltip>
                  </Stack>
                </Stack>
                {/* Контактна інформація */}
                <Box sx={{ mb: 1 }}>
                  {owner?.email && (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Email: {owner.email}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#156ff5',
                    color: '#fff',
                    fontWeight: 600,
                    mt: 2,
                    mb: 1,
                    textTransform: 'none',
                    fontSize: 16,
                  }}
                  startIcon={<Email />}
                  onClick={handleContactSeller}
                >
                  Написати продавцю
                </Button>
              </Paper>
            </CardContent>
          </Card>

          {/* Блок інших оголошень продавця */}
          <SellerOtherListings listings={ownerVehicles} currentVehicleId={vehicle?.id} />
        </Grid>
      </Grid>

      {/* Message Modal */}
      {vehicle && user && (
        <MessageModal
          open={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
          vehicle={vehicle}
          receiverId={vehicle.user}
        />
      )}
    </Container>
  );
};

export default VehicleDetailPage;
