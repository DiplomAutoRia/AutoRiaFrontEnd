import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsReadIcon from '@mui/icons-material/MarkEmailRead';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';

interface Notification {
  id: number;
  username: string;
  title: string;
  date: string;
  message: string;
}

interface NotificationsFormProps {
  notifications?: Notification[];
}

export default function NotificationsForm({ notifications = [] }: NotificationsFormProps) {
  const [expandedNotificationId, setExpandedNotificationId] = useState<number | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleNotificationToggle = (id: number) => {
    setExpandedNotificationId(prevId => prevId === id ? null : id);
  };

  const handleSelectNotification = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
    setSelectAll(!selectAll);
  };

  const defaultNotifications = [
    {
      id: 1,
      username: 'John Doe',
      title: 'Нова пропозиція для вашого авто',
      date: '12.05.2024',
      message: 'Доброго дня! Мене цікавить ваше авто BMW X5. Чи можна домовитись про зустріч?',
    },
    {
      id: 2,
      username: 'AutoRia Team',
      title: 'Акція на страхування',
      date: '11.05.2024',
      message: 'Спеціальна пропозиція: знижка 15% на страхування для власників BMW.',
    },
    {
      id: 3,
      username: 'CarDealer UA',
      title: 'Нові надходження',
      date: '10.05.2024',
      message: 'У нас з\'явились нові автомобілі марки Audi. Запрошуємо на перегляд.',
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <Paper elevation={1} sx={{ borderRadius: 0, p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Сповіщення
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ borderRadius: 0 }}
        >
          Налаштування
        </Button>
      </Box>

      {/* Filter buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {['Всі', 'Акції', 'Продаж', 'Купівля', 'Обране', 'Інформаційні', 'Архів'].map((label) => (
          <Button
            key={label}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 0, minWidth: 'auto', px: 1.5 }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* Actions row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox 
            size="small" 
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <Typography variant="body2">вибрати все</Typography>
        </Box>
        <Select
          size="small"
          defaultValue=""
          displayEmpty
          sx={{ minWidth: 120, borderRadius: 0 }}
        >
          <MenuItem value="">Дії</MenuItem>
          <MenuItem value="delete">Видалити</MenuItem>
          <MenuItem value="archive">Архівувати</MenuItem>
          <MenuItem value="send">Надіслати</MenuItem>
        </Select>
        <Button variant="contained" size="small" sx={{ borderRadius: 0 }}>
          Застосувати
        </Button>
      </Box>

      {/* Notifications list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {displayNotifications.map((notification) => (
          <Paper 
            key={notification.id} 
            elevation={1} 
            sx={{ 
              p: 2, 
              borderRadius: 0,
              transition: 'all 0.3s ease',
              height: expandedNotificationId === notification.id ? 'auto' : '60px',
              minHeight: '60px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Checkbox */}
              <Checkbox 
                size="small" 
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => handleSelectNotification(notification.id)}
              />

              {/* Icon */}
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {notification.username[0]}
              </Avatar>

              {/* User info and title */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {notification.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.title}
                </Typography>
              </Box>

              {/* Date and expand button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {notification.date}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleNotificationToggle(notification.id)}
                >
                  {expandedNotificationId === notification.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* Expanded content */}
            {expandedNotificationId === notification.id && (
              <Box sx={{ mt: 2, pl: 6 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {notification.message}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="outlined" size="small" sx={{ borderRadius: 0 }}>
                    Дивитись
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" title="Архівувати">
                      <ArchiveIcon />
                    </IconButton>
                    <IconButton size="small" title="Видалити">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small" title="Позначити як прочитане">
                      <MarkAsReadIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      title="Згорнути"
                      onClick={() => handleNotificationToggle(notification.id)}
                    >
                      <ExpandLessIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
