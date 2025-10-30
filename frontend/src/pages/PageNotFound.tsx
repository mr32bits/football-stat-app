import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-w-96">
      <h1 className="font-bold italic self-center">404</h1>
      <Separator className="my-3" />
      <div className="text-muted-foreground text-center">
        {t("Error.PageNotFound.Message")}
      </div>
      <Button className="mt-4" onClick={() => navigate(-1)}>
        {<ArrowLeft />}
        {t("Error.PageNotFound.Back")}
      </Button>
    </div>
  );
}
export default PageNotFound;
