import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Header from '../common/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState({}); // Track expanded items by transactionId

  const BAP_SERVER_URL = 'http://192.168.29.243:5000/beckn';

  useEffect(() => {
    const loadUserAndTransactions = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          console.warn("User ID not found.");
          return;
        }

        const response = await fetch(`${BAP_SERVER_URL}/transactions`);
        const data = await response.json();

        // Filter only this user's transactions
        const userTransactions = data.filter(txn => txn?.bill?.userId === userId);

        // Sort by latest first
        const sortedData = userTransactions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTransactions(sortedData);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndTransactions();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = !!expandedIds[item.transactionId];

    return (
      <View style={styles.item}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.amount}>₹{item.bill.amount}</Text>
            <Text style={styles.stationId}>Station ID: {item.bill.stationId}</Text>
          </View>
          <View style={styles.rightTop}>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              onPress={() => toggleExpand(item.transactionId)}
              style={styles.detailsButton}
            >
              <Text style={styles.detailsButtonText}>
                {isExpanded ? 'Hide Details' : 'Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedView}>
            <Text>Transaction ID: {item.transactionId}</Text>
            <Text>Status: {item.status}</Text>
            <Text>User ID: {item.bill.userId}</Text>
            <Text>Time: {new Date(item.createdAt).toLocaleString()}</Text>
            {item.confirmedAt && (
              <Text>Confirmed At: {new Date(item.confirmedAt).toLocaleString()}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <Header title="History" />

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.transactionId}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
                No transactions found.
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stationId: {
    fontSize: 14,
    color: '#555',
  },
  rightTop: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#5bc99d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  expandedView: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
});

export default History;
