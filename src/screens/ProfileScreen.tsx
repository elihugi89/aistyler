import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  ListItem,
  Divider,
  Avatar,
} from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const userStats = {
    totalOutfits: 24,
    savedOutfits: 12,
    wardrobeItems: 45,
    favoriteStyle: 'Elegant',
  };

  const recentActivity = [
    { id: '1', action: 'Created outfit', item: 'Evening Wedding Look', time: '2 hours ago' },
    { id: '2', action: 'Added item', item: 'Black Blazer', time: '1 day ago' },
    { id: '3', action: 'Saved outfit', item: 'Business Professional', time: '2 days ago' },
    { id: '4', action: 'Created outfit', item: 'Casual Weekend', time: '3 days ago' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged out') },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <View style={styles.header}>
        <Avatar
          size="large"
          rounded
          icon={{ name: 'person', type: 'ionicon' }}
          containerStyle={[styles.avatar, { backgroundColor: '#6366f1' }]}
        />
        <Text style={[styles.userName, { fontSize: 24, fontWeight: 'bold' }]}>Sarah Johnson</Text>
        <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
      </View>

      <Card containerStyle={styles.statsCard}>
        <Card.Title>Your Styling Stats</Card.Title>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalOutfits}</Text>
            <Text style={styles.statLabel}>Total Outfits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.savedOutfits}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.wardrobeItems}</Text>
            <Text style={styles.statLabel}>Wardrobe Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.favoriteStyle}</Text>
            <Text style={styles.statLabel}>Favorite Style</Text>
          </View>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Recent Activity</Card.Title>
        {recentActivity.map((activity, index) => (
          <View key={activity.id}>
            <ListItem key={activity.id}>
              <Ionicons 
                name="time-outline" 
                size={20} 
                color="#6366f1" 
              />
              <ListItem.Content>
                <ListItem.Title style={styles.activityTitle}>
                  {activity.action}: {activity.item}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.activityTime}>
                  {activity.time}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            {index < recentActivity.length - 1 && <Divider />}
          </View>
        ))}
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Preferences</Card.Title>
        
        <ListItem>
          <Ionicons name="notifications-outline" size={20} color="#6366f1" />
          <ListItem.Content>
            <ListItem.Title>Push Notifications</ListItem.Title>
            <ListItem.Subtitle>Get notified about new outfit suggestions</ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#6366f1' }}
          />
        </ListItem>

        <Divider />

        <ListItem>
          <Ionicons name="moon-outline" size={20} color="#6366f1" />
          <ListItem.Content>
            <ListItem.Title>Dark Mode</ListItem.Title>
            <ListItem.Subtitle>Switch to dark theme</ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#767577', true: '#6366f1' }}
          />
        </ListItem>
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Account Settings</Card.Title>
        
        <ListItem onPress={() => Alert.alert('Edit Profile', 'Edit profile functionality')}>
          <Ionicons name="person-outline" size={20} color="#6366f1" />
          <ListItem.Content>
            <ListItem.Title>Edit Profile</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Divider />

        <ListItem onPress={() => Alert.alert('Privacy', 'Privacy settings')}>
          <Ionicons name="shield-outline" size={20} color="#6366f1" />
          <ListItem.Content>
            <ListItem.Title>Privacy Settings</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Divider />

        <ListItem onPress={() => Alert.alert('Help', 'Help and support')}>
          <Ionicons name="help-circle-outline" size={20} color="#6366f1" />
          <ListItem.Content>
            <ListItem.Title>Help & Support</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Divider />

        <ListItem onPress={() => Alert.alert('About', 'About Stylist AI')}>
          <Ionicons name="information-circle-outline" size={20} color="#6366f1" />
          <ListItem.Content>
            <ListItem.Title>About</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>

      <Button
        title="Logout"
        type="outline"
        onPress={handleLogout}
        containerStyle={styles.logoutButton}
        buttonStyle={[styles.logoutButtonStyle, { borderColor: '#ef4444' }]}
        titleStyle={{ color: '#ef4444' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
  },
  statsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginVertical: 8,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
  logoutButtonStyle: {
    borderRadius: 12,
    paddingVertical: 12,
  },
});

export default ProfileScreen; 