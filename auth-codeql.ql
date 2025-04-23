import javascript
import semmle.javascript.Expr
from MemberAccessExpr ma
where ma.getMember() = "body" and
    ma.getQualifier() instanceof PropertyAccess and
    ma.getQualifier().toString().matches("ctx.request")
select ma, "Доступ к ctx.request.body"

