import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import PrinterService from '../services/PrinterService';
import PresentAbsentControl from './PresentAbsentControl';
import PassportInformation from './parts/PassportInformation';
import InterviewSchedules from './parts/InterviewSchedules';

interface ApplicationDetailsProps {
  data: any;
  onClose: () => void;
  onRefetch: (qrCode: string) => void;
  scannedData: string;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  data,
  onClose,
  onRefetch,
  scannedData,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);

  console.log(data);

  useEffect(() => {
    // Get initial connection status
    const device = PrinterService.getConnectedDevice();
    setConnectedDevice(device);

    // Listen for connection changes
    const listener = (device: any) => {
      setConnectedDevice(device);
    };
    PrinterService.addConnectionListener(listener);

    return () => {
      PrinterService.removeConnectionListener(listener);
    };
  }, []);

  const refetchData = () => {
    onRefetch(scannedData);
  };

  const formatDate = (dateString: string) => {
    return dateString || 'N/A';
  };

  const printTicket = async () => {
    // Check if printer is connected
    if (!PrinterService.isConnected()) {
      Alert.alert(
        'Not Connected',
        'Please connect to a printer first from the Printer tab.',
      );
      return;
    }

    setIsPrinting(true);
    try {
      // Get ticket data
      const jobTitleFull = data.job?.title || 'N/A';
      const jobTitle =
        jobTitleFull.length > 14
          ? jobTitleFull.substring(0, 14) + '.'
          : jobTitleFull;
      const companyNameFull = data.job?.client?.name || 'N/A';
      const companyName =
        companyNameFull.length > 14
          ? companyNameFull.substring(0, 14) + '.'
          : companyNameFull;

      const candidateName = data.user?.full_name || 'N/A';
      const phone = data.user?.phone || 'N/A';
      const interviewDate = data.schedule?.schedule?.date_formatted || 'N/A';
      const interviewTime = data.schedule?.schedule?.time_formatted || 'N/A';
      const jobApplicationSl = data?.job_application_sl || 'N/A';
      const applicationId = data?.application_id || 'N/A';
      const nidNo = data.user?.nid_no || 'N/A';
      const passportNo = data.user?.passport_no || 'N/A';

      // Initialize printer first
      await PrinterService.initPrinter();
      // Print in separate commands to avoid buffer issues

      // Header with decorative border
      // await PrinterService.printText('\x1B\x61\x00', {}); // Left align
      await PrinterService.printText(
        `${interviewDate} - ${interviewTime}\n`,
        {},
      );

      // Serial Number (Bold and Large)
      await PrinterService.printText(`Serial Number: ${jobApplicationSl} \n`, {
        bold: true,
        size: 2,
      });
      await PrinterService.printText('--------------------------------\n', {});

      // Candidate & Job Details
      await PrinterService.printText(`${jobTitle}(${companyName})\n\n`, {
        bold: true,
        size: 2,
      });
      await PrinterService.printText(`  Name: ${candidateName}\n`, {});
      await PrinterService.printText(`  Phone: ${phone}\n`, {});
      passportNo !== 'N/A'
        ? await PrinterService.printText(
            `  Passport: ${
              passportNo && passportNo !== 'N/A' ? passportNo : 'Not Available'
            }\n`,
            {},
          )
        : await PrinterService.printText(
            `  NID No: ${nidNo && nidNo !== 'N/A' ? nidNo : 'Not Available'}\n`,
            {},
          );

      await PrinterService.printText('--------------------------------\n', {});

      // Barcode (Application ID) - Scannable
      // Set barcode height (default 162)
      await PrinterService.printText('\x1D\x68\x50', {}); // Height: 80 dots

      // Set barcode width (2-6, default 3)
      await PrinterService.printText('\x1D\x77\x02', {}); // Width: 2

      // Print barcode - CODE128 format
      const barcodeData = applicationId.toString();
      const barcodeLength = String.fromCharCode(barcodeData.length);
      await PrinterService.printText(
        `\x1D\x6B\x49${barcodeLength}${barcodeData}`,
        {},
      );

      // Print ID below barcode
      // await PrinterService.printText(`\nID: ${applicationId}\n`, {});

      await PrinterService.printText('--------------------------------\n', {});

      // Evaluation Section
      await PrinterService.printText('Shortlisted | Rejected | Hold\n', {});

      await PrinterService.printText('Score: ___________\n', {});

      await PrinterService.printText('--------------------------------\n', {});

      // Signature Section
      await PrinterService.printText(
        'Signature: _________________\n\n\n\n',
        {},
      );

      Alert.alert('Success', 'Ticket printed successfully!');
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Print Error', `Failed to print ticket: ${error}`);
    } finally {
      setIsPrinting(false);
    }
  };

  console.log(data);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Application Details</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Present/Absent Control Component */}
        <PresentAbsentControl
          application_id={data.id}
          data={data?.schedule}
          onUpdate={refetchData}
        />

        {/* Application Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <View style={styles.card}>
            <View style={styles.serialNumberContainer}>
              <Text style={styles.serialNumberLabel}>Serial Number</Text>
              <Text style={styles.serialNumberValue}>
                {data?.job_application_sl || 'N/A'}
              </Text>
            </View>
            <InfoRow label="Application ID" value={data.application_id} />
            <InfoRow label="Status" value={data.status} badge />
            <InfoRow label="Applied Date" value={formatDate(data.created_at)} />
            <InfoRow
              label="SL No."
              value={data.job_application_sl?.toString()}
            />
            <InfoRow
              label="Sortlisted"
              value={data.sortlisted ? 'Yes' : 'No'}
            />
            <InfoRow
              label="Sortlist Date"
              value={formatDate(data.sortlist_date_formatted)}
            />
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
                    source={{ uri: data.user.candidate_image_url }}
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
              <InfoRow
                label="Education"
                value={data.user.educational_qualification}
              />
            </View>
          </View>
        )}

        {/* passport information  */}
        <PassportInformation data={data} />

        {/* Job Information */}
        {data.job && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Information</Text>
            <View style={styles.card}>
              <InfoRow label="Job Title" value={data.job.title} />
              <InfoRow label="Vacancy Code" value={data.job.vacancy_code} />
              <InfoRow
                label="Total Vacancy"
                value={data.job.total_vacancy?.toString()}
              />
              <InfoRow label="Basic Salary" value={data.job.basic_salary} />
              <InfoRow
                label="Contract Length"
                value={data.job.contract_length}
              />
              <InfoRow
                label="Experience Required"
                value={data.job.experience}
              />
              <InfoRow label="Min Age" value={data.job.min_age} />
              <InfoRow label="Max Age" value={data.job.max_age} />
              <InfoRow label="Qualification" value={data.job.qualification} />
              <InfoRow label="Language" value={data.job.language} />
              <InfoRow
                label="Interview Date"
                value={formatDate(data.job.interview_date_formatted)}
              />
              <InfoRow
                label="Expiry Date"
                value={formatDate(data.job.expiry_date_formatted)}
              />
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
            <InfoRow
              label="Bangladeshi Experience"
              value={`${data.bangladeshi_exp} years`}
            />
            <InfoRow
              label="Overseas Experience"
              value={`${data.overseas_exp} years`}
            />
            <InfoRow
              label="Current Salary"
              value={data.current_salary?.toString()}
            />
            <InfoRow
              label="Expected Salary"
              value={data.expected_salary?.toString()}
            />
          </View>
        </View>

        {/* Interview Schedule */}
        {data.schedule && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interview Schedule</Text>
            <View style={styles.card}>
              <InfoRow label="Status" value={data.schedule.status} badge />
              <InfoRow
                label="Date"
                value={formatDate(data.schedule.schedule?.date_formatted)}
              />
              <InfoRow
                label="Time"
                value={data.schedule.schedule?.time_formatted}
              />
              <InfoRow label="Type" value={data.schedule.schedule?.type} />
              <InfoRow
                label="Contact Number"
                value={data.schedule.schedule?.contact_number}
              />
              {data.schedule.schedule?.venue && (
                <>
                  <InfoRow
                    label="Venue"
                    value={data.schedule.schedule.venue.name}
                  />
                  <InfoRow
                    label="Address"
                    value={data.schedule.schedule.venue.address}
                  />
                </>
              )}
              <InfoRow
                label="Attendance"
                value={data.schedule.attendance ? 'Present' : 'Absent'}
              />
              <InfoRow
                label="Will Come"
                value={
                  data.schedule.will_come === null
                    ? 'Not Confirmed'
                    : data.schedule.will_come
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
          </View>
        )}

        {/* Interview schedules */}
       <InterviewSchedules data={data?.job?.schedules} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Print Button */}
      <View style={styles.printButtonContainer}>
        {connectedDevice ? (
          <View style={styles.connectedInfo}>
            <Text style={styles.connectedText}>
              ✓ Connected to: {connectedDevice.name || 'Printer'}
            </Text>
            <TouchableOpacity
              style={[
                styles.printButton,
                isPrinting && styles.printButtonDisabled,
              ]}
              onPress={printTicket}
              disabled={isPrinting}
            >
              {isPrinting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.printButtonText}>
                  🖨️ Print Interview Ticket
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.notConnectedInfo}>
            <Text style={styles.notConnectedText}>
              ⚠️ Printer not connected
            </Text>
            <Text style={styles.notConnectedSubText}>
              Please connect to a printer from the Printer tab first
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export const InfoRow = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) => {
  if (!value || value === 'null' || value === 'undefined') return null;

  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      {badge ? (
        <View
          style={[
            styles.badge,
            value === 'viewed' && styles.badgeViewed,
            value === 'notified' && styles.badgeNotified,
          ]}
        >
          <Text style={styles.badgeText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 1 },
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
    flex: 1 / 2,
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
  serialNumberContainer: {
    backgroundColor: '#F5F9FF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  serialNumberLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  serialNumberValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    letterSpacing: 1,
  },
  passportImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  qrCodeLabel: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
  printButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectedInfo: {
    gap: 10,
  },
  connectedText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  notConnectedInfo: {
    padding: 10,
    alignItems: 'center',
  },
  notConnectedText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
    marginBottom: 5,
  },
  notConnectedSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  printButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  printButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  printButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressSideBySideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusValue: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  scoreNotProvided: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ApplicationDetails;
