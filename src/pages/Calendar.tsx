import Header from "@/components/Header";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Building2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { format, isToday, isSameDay, parseISO, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useNavigate } from "react-router-dom";

interface CalendarEvent {
  id: string;
  title: string;
  company: string;
  date: Date;
  time: string;
  type: "interview" | "aptitude" | "deadline" | "follow-up";
  location?: string;
}

const getEventTypeColor = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "interview":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "aptitude":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "deadline":
      return "bg-red-100 text-red-800 border-red-200";
    case "follow-up":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEventTypeLabel = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "interview":
      return "면접";
    case "aptitude":
      return "인적성/역량검사";
    case "deadline":
      return "마감";
    case "follow-up":
      return "연락";
    default:
      return "기타";
  }
};

const Calendar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Convert companies data to calendar events
  useEffect(() => {
    if (companies.length === 0) return;

    const calendarEvents: CalendarEvent[] = companies
      .filter(company => company.deadline) // Only companies with deadlines
      .map(company => {
        const deadlineDate = parseISO(company.deadline!);
        
        return {
          id: company.id,
          title: getEventTitle(company.status),
          company: company.name,
          date: deadlineDate,
          time: format(deadlineDate, "HH:mm"),
          type: getEventType(company.status),
          location: undefined
        };
      });

    setEvents(calendarEvents);
  }, [companies]);

  const getEventTitle = (status: string) => {
    switch (status) {
      case "pending":
        return "지원 마감";
      case "applied":
        return "서류 결과 발표";
      case "aptitude":
        return "인적성/역량검사";
      case "interview":
        return "면접";
      default:
        return "일정";
    }
  };

  const getEventType = (status: string): CalendarEvent["type"] => {
    switch (status) {
      case "pending":
        return "deadline";
      case "aptitude":
        return "aptitude";
      case "interview":
        return "interview";
      default:
        return "follow-up";
    }
  };

  // Show loading spinner while checking auth or loading companies
  if (loading || isLoadingCompanies) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const eventsForSelectedDate = events.filter(event =>
    isSameDay(event.date, selectedDate)
  );

  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(event.date, date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const renderDayContent = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    const dayNumber = date.getDate();
    
    if (dayEvents.length === 0) {
      return <span>{dayNumber}</span>;
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-start pt-1">
        <div className="text-sm font-medium mb-1">{dayNumber}</div>
        <div className="w-full space-y-0.5 px-0.5">
          {dayEvents.slice(0, 2).map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="text-xs px-1 py-0.5 rounded text-center truncate bg-indigo-100 text-indigo-800 border border-indigo-200"
              title={`${event.company} - ${event.title}`}
            >
              <div className="font-medium truncate">{event.company}</div>
              <div className="text-[10px] truncate">{getEventTypeLabel(event.type)}</div>
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-[10px] text-gray-500 text-center">
              +{dayEvents.length - 2}개
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            캘린더
          </h1>
          <p className="text-gray-600">
            취업 관련 일정을 관리하세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 캘린더 */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  {format(selectedDate, "yyyy년 M월", { locale: ko })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="w-full max-w-none rounded-lg border-0 text-base"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-lg font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-200 rounded-md hover:bg-gray-50",
                    nav_button_previous: "absolute left-3",
                    nav_button_next: "absolute right-3",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-gray-500 rounded-md w-full font-medium text-sm py-2",
                    row: "flex w-full mt-2",
                    cell: "h-20 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-20 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                    day_range_end: "day-range-end",
                    day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white",
                    day_today: "bg-gray-100 text-gray-900 font-semibold",
                    day_outside: "day-outside text-gray-300 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                    day_disabled: "text-gray-300 opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  components={{
                    DayContent: ({ date }) => renderDayContent(date)
                  }}
                  modifiers={{
                    hasEvents: (date) => hasEvents(date),
                    today: (date) => isToday(date)
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* 선택된 날짜의 일정 */}
          <div>
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {format(selectedDate, "M월 d일 일정", { locale: ko })}
                  {isToday(selectedDate) && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      오늘
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventsForSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>등록된 일정이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {event.title}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={getEventTypeColor(event.type)}
                          >
                            {getEventTypeLabel(event.type)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>{event.company}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 이번 주 일정 요약 */}
            <Card className="shadow-sm border-0 bg-white mt-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">이번 주 일정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {event.company} • {format(event.date, "M/d")}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type)} text-xs`}
                      >
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">등록된 일정이 없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
