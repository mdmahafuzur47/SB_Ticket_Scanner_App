import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';

interface ApplicationDetailsProps {
  data: any;
  onClose: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({data, onClose}) => {
  if (!data) return null;

  const formatDate = (dateString: string) => {
    return dateString || 'N/A';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Application Details</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Application Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <View style={styles.card}>
            <InfoRow label="Application ID" value={data.application_id} />
            <InfoRow label="Status" value={data.status} badge />
            <InfoRow label="Applied Date" value={formatDate(data.created_at)} />
            <InfoRow label="SL No." value={data.job_application_sl?.toString()} />
            <InfoRow label="Sortlisted" value={data.sortlisted ? 'Yes' : 'No'} />
            <InfoRow label="Sortlist Date" value={formatDate(data.sortlist_date_formatted)} />
          </View>
        </View>

        {/* Candidate Info */}
        {data.user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Candidate Information</Text>
            <View style={styles.card}>
              {data.user.candidate_image_url && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: data.user.candidate_image_url}}
                    style={styles.candidateImage}
                  />
                </View>
              )}
              <InfoRow label="Full Name" value={data.user.full_name} />
              <InfoRow label="Phone" value={data.user.phone} />
              <InfoRow label="Email" value={data.user.email} />
              <InfoRow label="Age" value={data.user.age?.toString()} />
              <InfoRow label="Gender" value={data.user.sex} />
              <InfoRow label="Date of Birth" value={data.user.dob_formatted} />
              <InfoRow label="NID No" value={data.user.nid_no} />
              <InfoRow label="Institute" value={data.user.institute} />
              <InfoRow label="Education" value={data.user.educational_qualification} />
            </View>
          </View>
        )}

        {/* Job Information */}
        {data.job && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Information</Text>
            <View style={styles.card}>
              <InfoRow label="Job Title" value={data.job.title} />
              <InfoRow label="Vacancy Code" value={data.job.vacancy_code} />
              <InfoRow label="Total Vacancy" value={data.job.total_vacancy?.toString()} />
              <InfoRow label="Basic Salary" value={data.job.basic_salary} />
              <InfoRow label="Contract Length" value={data.job.contract_length} />
              <InfoRow label="Experience Required" value={data.job.experience} />
              <InfoRow label="Min Age" value={data.job.min_age} />
              <InfoRow label="Max Age" value={data.job.max_age} />
              <InfoRow label="Qualification" value={data.job.qualification} />
              <InfoRow label="Language" value={data.job.language} />
              <InfoRow label="Interview Date" value={formatDate(data.job.interview_date_formatted)} />
              <InfoRow label="Expiry Date" value={formatDate(data.job.expiry_date_formatted)} />
            </View>
          </View>
        )}

        {/* Experience Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Information</Text>
          <View style={styles.card}>
            <InfoRow label="Last Company" value={data.last_company} />
            <InfoRow label="Last Position" value={data.last_position} />
            <InfoRow label="Experience Info" value={data.experience_info} />
            <InfoRow label="Bangladeshi Experience" value={`${data.bangladeshi_exp} years`} />
            <InfoRow label="Overseas Experience" value={`${data.overseas_exp} years`} />
            <InfoRow label="Current Salary" value={data.current_salary?.toString()} />
            <InfoRow label="Expected Salary" value={data.expected_salary?.toString()} />
          </View>
        </View>

        {/* Interview Schedule */}
        {data.schedule && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interview Schedule</Text>
            <View style={styles.card}>
              <InfoRow label="Status" value={data.schedule.status} badge />
              <InfoRow label="Date" value={formatDate(data.schedule.schedule?.date_formatted)} />
              <InfoRow label="Time" value={data.schedule.schedule?.time_formatted} />
              <InfoRow label="Type" value={data.schedule.schedule?.type} />
              <InfoRow label="Contact Number" value={data.schedule.schedule?.contact_number} />
              {data.schedule.schedule?.venue && (
                <>
                  <InfoRow label="Venue" value={data.schedule.schedule.venue.name} />
                  <InfoRow label="Address" value={data.schedule.schedule.venue.address} />
                </>
              )}
              <InfoRow label="Attendance" value={data.schedule.attendance || 'Not Marked'} />
              <InfoRow label="Will Come" value={data.schedule.will_come === null ? 'Not Confirmed' : data.schedule.will_come ? 'Yes' : 'No'} />
            </View>
          </View>
        )}

        {/* Interview Stages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interview Progress</Text>
          <View style={styles.card}>
            <InfoRow label="Face to Face 1" value={data.ftf_one ? '✓ Passed' : '✗ Not Passed'} />
            <InfoRow label="Face to Face 2" value={data.ftf_two ? '✓ Passed' : '✗ Not Passed'} />
            <InfoRow label="Online Test" value={data.online_test ? '✓ Completed' : '✗ Not Completed'} />
            <InfoRow label="Score" value={data.schedule?.score || 'Not Graded'} />
          </View>
        </View>

        {/* Interview Pass Link */}
        {data.interview_pass_link && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interview Pass</Text>
            <View style={styles.card}>
              <Text style={styles.linkText}>{data.interview_pass_link}</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const InfoRow = ({label, value, badge}: {label: string; value: string; badge?: boolean}) => {
  if (!value || value === 'null' || value === 'undefined') return null;
  
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      {badge ? (
        <View style={[styles.badge, value === 'viewed' && styles.badgeViewed, value === 'notified' && styles.badgeNotified]}>
          <Text style={styles.badgeText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeViewed: {
    backgroundColor: '#2196F3',
  },
  badgeNotified: {
    backgroundColor: '#FF9800',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  candidateImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ApplicationDetails;
