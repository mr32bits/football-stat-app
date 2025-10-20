import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import i18next from "i18next";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-w-96">
      <h1 className="font-bold italic self-center">404</h1>
      <Separator className="my-3" />
      <div className="text-muted-foreground text-center">
        {i18next.t("Error.PageNotFound.Message")}
      </div>
      <Button className="mt-4" onClick={() => navigate(-1)}>
        {<ArrowLeft />}
        {i18next.t("Error.PageNotFound.Back")}
      </Button>
    </div>
  );
}
export default PageNotFound;
