import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import TermsModal from './TermsModal';
import logo from '../assets/gramador-logo.png';
import { getCountryFlag } from '../utils/countryFlags';

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  gender: string;
  year: string;
  month: string;
  day: string;
  phone: string;
  email: string;
  acceptTerms: boolean;
}

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    mode: 'onBlur',
    defaultValues: {
      phone: '+40',
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configurable Store Name
  const storeName = import.meta.env.VITE_STORE_NAME || 'Gramador';

  const selectedYear = useWatch({ control, name: 'year' });
  const selectedMonth = useWatch({ control, name: 'month' });
  const selectedDay = useWatch({ control, name: 'day' });
  const phoneValue = useWatch({ control, name: 'phone' }) || '';

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear - 16;
    const yearsList = [];

    for (let i = maxYear; i >= maxYear - 100; i--) {
      yearsList.push(i.toString());
    }

    return yearsList;
  }, []);

  const months = useMemo(
    () => [
      { value: '1', label: t('months.jan') },
      { value: '2', label: t('months.feb') },
      { value: '3', label: t('months.mar') },
      { value: '4', label: t('months.apr') },
      { value: '5', label: t('months.may') },
      { value: '6', label: t('months.jun') },
      { value: '7', label: t('months.jul') },
      { value: '8', label: t('months.aug') },
      { value: '9', label: t('months.sep') },
      { value: '10', label: t('months.oct') },
      { value: '11', label: t('months.nov') },
      { value: '12', label: t('months.dec') },
    ],
    [t]
  );

  const days = useMemo(() => {
    let daysInMonth = 31;
    if (selectedYear && selectedMonth) {
      daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    }
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
      if (parseInt(selectedDay) > daysInMonth) {
        setValue('day', '');
      }
    }
  }, [selectedYear, selectedMonth, selectedDay, setValue]);

  useEffect(() => {
    const handleVisualViewportResize = () => {
      if (!window.visualViewport) return;

      // Only scroll if the viewport height decreased significantly (likely keyboard)
      const isKeyboardVisible = window.visualViewport.height < window.innerHeight * 0.85;

      if (isKeyboardVisible) {
        const activeElement = document.activeElement as HTMLElement;
        if (
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.tagName === 'TEXTAREA')
        ) {
          // Timeout to ensure the keyboard is fully up and layout is stable
          setTimeout(() => {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }, 100);
        }
      }
    };

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', handleVisualViewportResize);
      viewport.addEventListener('scroll', handleVisualViewportResize);
      return () => {
        viewport.removeEventListener('resize', handleVisualViewportResize);
        viewport.removeEventListener('scroll', handleVisualViewportResize);
      };
    }
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const onSubmit = async (data: OnboardingFormData) => {
    setSubmitting(true);
    try {
      const { db, auth } = await import('../firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      const dob = `${data.year}-${data.month.padStart(2, '0')}-${data.day.padStart(2, '0')}`;

      const currentUser = auth.currentUser;

      await addDoc(collection(db, 'loyalty'), {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dob,
        phone: data.phone,
        email: data.email,
        storeName,
        createdAt: serverTimestamp(),
        createdBy: currentUser
          ? {
              uid: currentUser.uid,
              email: currentUser.email,
            }
          : null,
      });

      setSubmitSuccess(true);

      // Start countdown
      let timer = 5;
      setCountdown(timer);
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          // Reset form and states
          reset();
          setSubmitSuccess(false);
          setCountdown(5);
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 1000);
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('A apărut o eroare la salvarea datelor. Te rugăm să încerci din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  const validateAge = () => {
    if (!selectedYear || !selectedMonth || !selectedDay) return true;

    const birthDate = new Date(
      parseInt(selectedYear),
      parseInt(selectedMonth) - 1,
      parseInt(selectedDay)
    );
    const today = new Date();

    if (birthDate > today) return t('validationAgeFuture');

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const finalAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    if (finalAge > 100) return t('validationAgeTooOld');

    return true;
  };

  const validatePhone = (value: string) => {
    if (!value) return true;

    // If it starts with Romanian prefix, enforce 9 digits after +40
    if (value.startsWith('+40')) {
      return /^\+40\d{9}$/.test(value) || t('validationPhone');
    }

    // If it starts with 07, enforce 10 digits total (Romanian local)
    if (value.startsWith('07')) {
      return /^07\d{8}$/.test(value) || t('validationPhone');
    }

    // Generic international validation for other prefixes
    return /^\+?[0-9\s-]{7,15}$/.test(value) || t('validationPhone');
  };

  return (
    <div className="w-full min-h-screen">
      <div className="glass-morphism min-h-screen p-8 sm:p-14 lg:p-20 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-16">
            <img
              src={logo}
              alt={storeName}
              className="h-48 sm:h-64 w-auto mx-auto mb-10 object-contain"
            />
            <h1 className="text-6xl sm:text-7xl font-black text-theme-base tracking-tight mb-6">
              {t('title')}
            </h1>
            <p className="text-theme-muted text-2xl sm:text-3xl font-medium">
              {t('subtitle', { storeName })}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <label htmlFor="firstName">
                  <span className="flex items-center">
                    <User className="w-6 h-6 mr-3 text-primary" /> {t('firstName')}
                  </span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName', { required: true })}
                  className={`${errors.firstName ? '!border-red-500 !ring-red-500 border-2' : ''}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {t('validationRequired')}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName">
                  <span className="flex items-center">
                    <User className="w-6 h-6 mr-3 text-primary" /> {t('lastName')}
                  </span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName', { required: true })}
                  className={`${errors.lastName ? '!border-red-500 !ring-red-500 border-2' : ''}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {t('validationRequired')}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <label>{t('gender')}</label>
                <div
                  className={`flex gap-8 mt-4 p-2 rounded-xl transition-all ${errors.gender ? 'border-2 border-red-500 bg-red-50/10' : ''}`}
                >
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      value="male"
                      {...register('gender', { required: true })}
                      className="w-8 h-8 text-primary border-theme-input-border focus:ring-primary focus:ring-offset-0 bg-theme-input transition-all duration-300 cursor-pointer"
                    />
                    <span className="ml-3 text-2xl font-semibold text-theme-base group-hover:text-primary transition-colors">
                      {t('genderM')}
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      value="female"
                      {...register('gender', { required: true })}
                      className="w-8 h-8 text-primary border-theme-input-border focus:ring-primary focus:ring-offset-0 bg-theme-input transition-all duration-300 cursor-pointer"
                    />
                    <span className="ml-3 text-2xl font-semibold text-theme-base group-hover:text-primary transition-colors">
                      {t('genderF')}
                    </span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {t('validationRequired')}
                  </p>
                )}
              </div>

              <div>
                <label>
                  <span className="flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-primary" /> {t('dob')}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    {...register('year', { required: true, validate: validateAge })}
                    className={`${errors.year || errors.day || errors.month ? '!border-red-500 !ring-red-500 border-2' : ''}`}
                  >
                    <option value="">{t('year')}</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <select
                    {...register('month', { required: true, validate: validateAge })}
                    className={`${errors.year || errors.day || errors.month ? '!border-red-500 !ring-red-500 border-2' : ''}`}
                  >
                    <option value="">{t('month')}</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <select
                    {...register('day', { required: true, validate: validateAge })}
                    className={`${errors.year || errors.day || errors.month ? '!border-red-500 !ring-red-500 border-2' : ''}`}
                  >
                    <option value="">{t('day')}</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.year && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {errors.year.message || t('validationRequired')}
                  </p>
                )}
                {!errors.year && (errors.month || errors.day) && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {t('validationRequired')}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <label htmlFor="phone">
                  <span className="flex items-center">
                    <Phone className="w-6 h-6 mr-3 text-primary" /> {t('phone')}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl z-10">
                    {getCountryFlag(phoneValue)}
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      required: true,
                      validate: validatePhone,
                    })}
                    className={`${errors.phone ? '!border-red-500 !ring-red-500 border-2' : ''} pl-16`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {errors.phone.message || t('validationRequired')}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email">
                  <span className="flex items-center">
                    <Mail className="w-6 h-6 mr-3 text-primary" /> {t('email')}
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                      message: t('validationEmail'),
                    },
                  })}
                  className={`${errors.email ? '!border-red-500 !ring-red-500 border-2' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-base mt-2 font-medium">
                    {errors.email.message || t('validationRequired')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start mt-10">
              <div className="flex items-center h-8">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className={`h-8 w-8 rounded-lg border-theme-input-border text-primary focus:ring-primary cursor-pointer transition-colors duration-300 ${errors.acceptTerms ? 'border-2 !border-red-500 !ring-red-500' : ''}`}
                  {...register('acceptTerms', { required: true })}
                />
              </div>
              <div className="ml-5 text-xl sm:text-2xl">
                <label
                  htmlFor="acceptTerms"
                  className={`font-medium text-theme-muted cursor-pointer transition-colors duration-300 ${errors.acceptTerms ? 'text-red-500' : ''}`}
                >
                  {t('acceptTerms')}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-primary font-black hover:text-primary-hover underline focus:outline-none ml-2"
                  >
                    {t('termsAndConditions')}
                  </button>
                </label>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-base font-medium mt-2">
                    {t('validationRequired')}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || submitSuccess}
              className={`primary group py-6 text-2xl ${submitting || submitSuccess ? 'opacity-70' : ''}`}
            >
              <span className="mr-3">{t('submit')}</span>
              <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {/* Loading / Success Overlay */}
      {(submitting || submitSuccess) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-bg/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="text-center p-12 rounded-3xl glass-morphism max-w-lg w-full mx-4 shadow-2xl scale-in-center overflow-hidden relative">
            {submitting && !submitSuccess ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
                <h2 className="text-4xl font-black text-theme-base mb-4 animate-pulse">
                  {t('submitting')}
                </h2>
                <p className="text-theme-muted text-xl">{t('pleaseWait')}</p>
              </div>
            ) : submitSuccess ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-lg shadow-green-500/50">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-5xl font-black text-theme-base mb-6 tracking-tight">
                  {t('successTitle')}
                </h2>
                <p className="text-theme-muted text-2xl font-medium mb-10 leading-relaxed text-center">
                  {t('submitSuccess', { count: countdown })}
                </p>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-theme-muted/10"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - countdown / 5)}
                      className="text-primary transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="text-4xl font-black text-primary">{countdown}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RegisterForm;
