import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const InterviewSchedules = ({ data }: any) => {
  // Helper function to format interview type
  const formatInterviewType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      ftf_one: 'Face to Face 1',
      ftf_two: 'Face to Face 2',
      online_test: 'Online Test',
      phone_interview: 'Phone Interview',
      final_interview: 'Final Interview',
    };
    return typeMap[type] || type;
  };

  // Helper function to format status
  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      notified: 'Notified',
      viewed: 'Viewed',
      confirmed: 'Confirmed',
      attended: 'Attended',
      passed: 'Passed',
      failed: 'Failed',
    };
    return statusMap[status] || status;
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      notified: '#FF9800',
      viewed: '#2196F3',
      confirmed: '#4CAF50',
      attended: '#4CAF50',
      passed: '#4CAF50',
      failed: '#F44336',
    };
    return colorMap[status] || '#666';
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Interview Schedules</Text>
      {data.map((schedule: any, index: number) => {
        const assign = schedule?.assigns?.[0];
        return (
          <View key={schedule.id || index} style={styles.card}>
            {/* Interview Type Header */}
            <View style={styles.scheduleHeader}>
              <Text style={styles.interviewType}>
                {formatInterviewType(schedule.type)}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(assign?.status) },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {formatStatus(assign?.status || 'N/A')}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>📅 Date</Text>
                <Text style={styles.infoValue}>
                  {schedule.date_formatted || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>🕐 Time</Text>
                <Text style={styles.infoValue}>
                  {schedule.time_formatted || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Contact & Attendance */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Contact</Text>
                <Text style={styles.detailValue}>
                  {schedule.contact_number || 'N/A'}
                </Text>
              </View>
              {assign && (
                <>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Attendance</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            assign.attendance === 1 ? '#4CAF50' : '#F44336',
                        },
                      ]}
                    >
                      {assign.attendance === 1
                        ? '✓ Present'
                        : assign.attendance === 0
                        ? '✗ Absent'
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Will Come</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            assign.will_come === 1
                              ? '#4CAF50'
                              : assign.will_come === 0
                              ? '#F44336'
                              : '#666',
                        },
                      ]}
                    >
                      {assign.will_come === 1
                        ? 'Yes'
                        : assign.will_come === 0
                        ? 'No'
                        : 'Not Confirmed'}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Score Section */}
            {assign && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Score</Text>
                {assign.score !== null && assign.score !== undefined ? (
                  <Text style={styles.scoreValue}>{assign.score}</Text>
                ) : (
                  <Text style={styles.scoreNotProvided}>Not provided yet</Text>
                )}
              </View>
            )}

            {/* WhatsApp Group Link */}
            {schedule.whats_app_group_link && (
              <View style={styles.linkContainer}>
                <Text style={styles.linkLabel}>💬 WhatsApp Group:</Text>
                <Text style={styles.linkText} numberOfLines={1}>
                  {schedule.whats_app_group_link}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  interviewType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoBlock: {
    flex: 1,
    alignItems: 'center',
  },
  infoDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  scoreNotProvided: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  linkContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
  },
  linkLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default InterviewSchedules;
