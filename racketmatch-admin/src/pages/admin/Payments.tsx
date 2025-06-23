import { PaymentTable } from '../../components/tables/PaymentTable';
import { usePayments } from '../../hooks/usePayments';

const PaymentsPage = () => {
  const { data: payments = [], isLoading, error } = usePayments();

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Error loading payments!</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <PaymentTable data={payments} />
    </div>
  );
};

export default PaymentsPage;
