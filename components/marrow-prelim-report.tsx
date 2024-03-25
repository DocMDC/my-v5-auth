import { Card, CardContent, CardHeader } from "@/components/ui/card";

type MarrowPrelimReportType = {
  finalDiagnosis: string;
  impression: string;
  wbc: number | null;
  hgb: number | null;
  plt: number | null;
  mcv: number | null;
  rdw: number | null;
  peripheralSmear: string | null;
};

export default function MarrowPrelimReport({
  finalDiagnosis,
  impression,
  wbc,
  hgb,
  plt,
  mcv,
  rdw,
  peripheralSmear,
}: MarrowPrelimReportType) {
  console.log(peripheralSmear);

  function renderPeripheralSmearText() {
    if (peripheralSmear === "received") {
      return <p>A Wright's stained peripheral smear is reviewed.</p>;
    } else if (peripheralSmear === "notReceived") {
      return (
        <p>A Wright's stained peripheral smear is not available for review.</p>
      );
    } else if (peripheralSmear === "normal") {
      return (
        <p>
          A Wright's stained peripheral smear is reviewed. The erythrocytes,
          leukocytes, and platelets are generally morphologically normal in
          appearance and adequate in number. There are no circulating blasts,
          plasma cells, or abnormal lymphocytes.
        </p>
      );
    } else if (peripheralSmear === "peripheralSmearCustomText") {
      return;
    }
  }

  return (
    <Card className="text-xs w-[350px] shadow-md mb-10 bg-gray-300 md:w-[500px] 2xl:w-[725px] lg:mb-0">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Preliminary Report</p>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <p className="text-lg font-bold bg-white inline-block px-2 rounded mb-1">
            Final Diagnosis:
          </p>
          <p className="uppercase">{finalDiagnosis}</p>
        </div>

        <div className="mb-8">
          <p className="text-lg font-bold bg-white inline-block px-2 rounded mb-1">
            Impression:
          </p>
          <p>{impression}</p>
        </div>

        <div className="mb-8">
          <p className="text-lg font-bold bg-white inline-block px-2 rounded mb-1">
            Peripheral Blood Smear:
          </p>
          <div className="text-xs 2xl:flex">
            {(wbc || hgb || plt || mcv || rdw) && <p>CBC :</p>}
            {wbc && <p className="2xl:ml-1">WBC: {wbc} k/microL,</p>}
            {hgb && <p className="2xl:ml-2">Hgb: {hgb} g/dL,</p>}
            {plt && <p className="2xl:ml-1">Plt: {plt} k/microL,</p>}
            {mcv && <p className="2xl:ml-1">MCV: {mcv} fL,</p>}
            {rdw && <p className="2xl:ml-1">RDW: {rdw} %</p>}
          </div>

          <div className="mt-2">{renderPeripheralSmearText()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
